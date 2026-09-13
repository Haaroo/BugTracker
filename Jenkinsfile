// CI/CD pipeline for BugTracker.
//
// Runs on any agent that has Docker available (the Jenkins container in
// jenkins/ is set up for exactly that, via Docker-in-Docker). Every build
// and test step runs inside a throwaway container, so the Jenkins agent
// itself never needs Go, Node or Playwright installed directly.
pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    environment {
        PLAYWRIGHT_IMAGE = 'mcr.microsoft.com/playwright:v1.55.0-jammy'
    }

    stages {
        stage('Backend: build & unit tests') {
            steps {
                dir('backend') {
                    sh '''
                        docker run --rm -v "$PWD":/app -w /app golang:1.24-alpine \
                            sh -c "go build ./... && go vet ./... && go test ./... -v -coverprofile=coverage.out"
                    '''
                }
            }
        }

        stage('Frontend: install, unit tests & build') {
            steps {
                dir('frontend') {
                    sh '''
                        docker run --rm -v "$PWD":/app -w /app node:20-alpine \
                            sh -c "npm ci && npm test -- --ci && npm run build"
                    '''
                }
            }
        }

        stage('Build application images') {
            steps {
                sh 'docker compose build'
            }
        }

        stage('Start stack for integration tests') {
            steps {
                sh 'docker compose up -d'
                sh '''
                    for i in $(seq 1 30); do
                        curl -sf http://localhost:8080/api/health && break
                        echo "waiting for backend..."; sleep 2
                    done
                    for i in $(seq 1 30); do
                        curl -sf http://localhost:3000 > /dev/null && break
                        echo "waiting for frontend..."; sleep 2
                    done
                '''
            }
        }

        stage('API tests') {
            steps {
                dir('tests-api') {
                    sh '''
                        docker run --rm --network host -v "$PWD":/tests -w /tests $PLAYWRIGHT_IMAGE \
                            sh -c "npm ci && npx playwright test"
                    '''
                }
            }
        }

        stage('E2E tests') {
            steps {
                dir('tests-e2e') {
                    sh '''
                        docker run --rm --network host -v "$PWD":/tests -w /tests $PLAYWRIGHT_IMAGE \
                            sh -c "npm ci && npx playwright test"
                    '''
                }
            }
        }

        stage('Performance tests') {
            steps {
                dir('tests-perf') {
                    sh 'docker run --rm --network host -v "$PWD":/perf -w /perf grafana/k6 run script.js'
                }
            }
        }
    }

    post {
        always {
            sh 'docker compose down -v || true'
            junit allowEmptyResults: true, testResults: '**/test-results/*.xml'
            archiveArtifacts allowEmptyArchive: true, artifacts: '**/playwright-report/**, **/perf-results.html, backend/coverage.out'
        }
    }
}
