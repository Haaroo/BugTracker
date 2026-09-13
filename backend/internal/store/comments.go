package store

import (
	"encoding/json"
	"fmt"
	"sort"
	"time"

	"bugtracker-api/internal/models"

	"go.etcd.io/bbolt"
)

// CreateComment attaches a new comment to bugID, failing with ErrNotFound
// if that bug doesn't exist.
func (s *Store) CreateComment(bugID int, input models.CommentInput) (*models.Comment, error) {
	var comment models.Comment
	err := s.db.Update(func(tx *bbolt.Tx) error {
		if tx.Bucket(bugsBucket).Get(itob(bugID)) == nil {
			return ErrNotFound
		}

		id, err := nextSeq(tx.Bucket(metaBucket), commentSeqKey)
		if err != nil {
			return err
		}

		comment = models.Comment{
			ID:        id,
			BugID:     bugID,
			Author:    input.Author,
			Content:   input.Content,
			CreatedAt: time.Now().UTC(),
		}

		data, err := json.Marshal(comment)
		if err != nil {
			return fmt.Errorf("encode comment: %w", err)
		}
		return tx.Bucket(commentsBucket).Put(itob(id), data)
	})
	if err != nil {
		return nil, err
	}
	return &comment, nil
}

// ListComments returns every comment for bugID, ordered by ID ascending.
func (s *Store) ListComments(bugID int) ([]*models.Comment, error) {
	comments := make([]*models.Comment, 0)
	err := s.db.View(func(tx *bbolt.Tx) error {
		if tx.Bucket(bugsBucket).Get(itob(bugID)) == nil {
			return ErrNotFound
		}
		return tx.Bucket(commentsBucket).ForEach(func(k, v []byte) error {
			var c models.Comment
			if err := json.Unmarshal(v, &c); err != nil {
				return fmt.Errorf("decode comment %x: %w", k, err)
			}
			if c.BugID == bugID {
				comments = append(comments, &c)
			}
			return nil
		})
	})
	if err != nil {
		return nil, err
	}
	sort.Slice(comments, func(i, j int) bool { return comments[i].ID < comments[j].ID })
	return comments, nil
}
