// Package store implements BugTracker's persistence layer on top of bbolt,
// an embedded key/value database. Keeping storage embedded means the API
// has zero external dependencies to run locally or in CI.
package store

import (
	"encoding/binary"
	"errors"
	"fmt"
	"sync"
	"time"

	"go.etcd.io/bbolt"
)

var (
	bugsBucket     = []byte("bugs")
	commentsBucket = []byte("comments")
	metaBucket     = []byte("meta")

	bugSeqKey     = []byte("bug_seq")
	commentSeqKey = []byte("comment_seq")
)

// ErrNotFound is returned when a bug (or a comment's parent bug) does not exist.
var ErrNotFound = errors.New("bug not found")

// Store wraps a bbolt database and exposes typed operations for bugs and
// comments. It is safe for concurrent use.
type Store struct {
	db *bbolt.DB
	mu sync.Mutex // guards operations that touch several buckets atomically
}

// Open creates (or reuses) the database file at path and ensures the
// buckets BugTracker needs exist.
func Open(path string) (*Store, error) {
	db, err := bbolt.Open(path, 0600, &bbolt.Options{Timeout: 2 * time.Second})
	if err != nil {
		return nil, fmt.Errorf("open database: %w", err)
	}

	err = db.Update(func(tx *bbolt.Tx) error {
		for _, bucket := range [][]byte{bugsBucket, commentsBucket, metaBucket} {
			if _, err := tx.CreateBucketIfNotExists(bucket); err != nil {
				return fmt.Errorf("create bucket %s: %w", bucket, err)
			}
		}
		return nil
	})
	if err != nil {
		db.Close()
		return nil, err
	}

	return &Store{db: db}, nil
}

// Close releases the underlying database file.
func (s *Store) Close() error {
	return s.db.Close()
}

func nextSeq(meta *bbolt.Bucket, key []byte) (int, error) {
	next := 1
	if raw := meta.Get(key); raw != nil {
		next = btoi(raw) + 1
	}
	if err := meta.Put(key, itob(next)); err != nil {
		return 0, fmt.Errorf("advance sequence %s: %w", key, err)
	}
	return next, nil
}

func itob(v int) []byte {
	b := make([]byte, 8)
	binary.BigEndian.PutUint64(b, uint64(v))
	return b
}

func btoi(b []byte) int {
	return int(binary.BigEndian.Uint64(b))
}
