module bugtracker-api

go 1.24

replace go.etcd.io/bbolt => github.com/etcd-io/bbolt v1.3.11

replace golang.org/x/sys => github.com/golang/sys v0.4.0

require (
	github.com/gorilla/handlers v1.5.2
	github.com/gorilla/mux v1.8.1
	github.com/stretchr/testify v1.10.0
	github.com/swaggo/http-swagger v1.3.4
	github.com/swaggo/swag v1.8.1
	go.etcd.io/bbolt v1.3.11
)

require (
	github.com/KyleBanks/depth v1.2.1 // indirect
	github.com/davecgh/go-spew v1.1.1 // indirect
	github.com/felixge/httpsnoop v1.0.3 // indirect
	github.com/go-openapi/jsonpointer v0.19.5 // indirect
	github.com/go-openapi/jsonreference v0.20.0 // indirect
	github.com/go-openapi/spec v0.20.6 // indirect
	github.com/go-openapi/swag v0.19.15 // indirect
	github.com/josharian/intern v1.0.0 // indirect
	github.com/mailru/easyjson v0.7.6 // indirect
	github.com/pmezard/go-difflib v1.0.0 // indirect
	github.com/swaggo/files v0.0.0-20220610200504-28940afbdbfe // indirect
	golang.org/x/net v0.7.0 // indirect
	golang.org/x/sys v0.5.0 // indirect
	golang.org/x/tools v0.1.12 // indirect
	gopkg.in/yaml.v2 v2.4.0 // indirect
	gopkg.in/yaml.v3 v3.0.1 // indirect
)

replace gopkg.in/yaml.v2 => github.com/go-yaml/yaml v2.4.0+incompatible

replace golang.org/x/tools => github.com/golang/tools v0.1.12

replace golang.org/x/net => github.com/golang/net v0.7.0

replace gopkg.in/check.v1 => github.com/go-check/check v0.0.0-20200227125254-8fa46927fb4f

replace gopkg.in/yaml.v3 => github.com/go-yaml/yaml v0.0.0-20200615113413-eeeca48fe776

replace golang.org/x/term => github.com/golang/term v0.5.0

replace golang.org/x/text => github.com/golang/text v0.7.0

replace golang.org/x/mod => github.com/golang/mod v0.6.0

replace golang.org/x/xerrors => github.com/golang/xerrors v0.0.0-20220907171357-04be3eba64a2

replace golang.org/x/sync => github.com/golang/sync v0.0.0-20220722155255-886fb9371eb4

replace golang.org/x/crypto => github.com/golang/crypto v0.1.0
