package store

import (
	"encoding/json"
	"fmt"
	"sort"
	"time"

	"bugtracker-api/internal/models"

	"go.etcd.io/bbolt"
)

// CreateBug persists a new bug and assigns it the next sequential ID.
func (s *Store) CreateBug(input models.BugInput) (*models.Bug, error) {
	var bug models.Bug

	err := s.db.Update(func(tx *bbolt.Tx) error {
		id, err := nextSeq(tx.Bucket(metaBucket), bugSeqKey)
		if err != nil {
			return err
		}

		now := time.Now().UTC()
		bug = models.Bug{
			ID:          id,
			Title:       input.Title,
			Description: input.Description,
			Status:      input.Status,
			Priority:    input.Priority,
			CreatedAt:   now,
			UpdatedAt:   now,
		}

		data, err := json.Marshal(bug)
		if err != nil {
			return fmt.Errorf("encode bug: %w", err)
		}
		return tx.Bucket(bugsBucket).Put(itob(id), data)
	})
	if err != nil {
		return nil, err
	}
	return &bug, nil
}

// GetBug fetches a single bug by ID, returning ErrNotFound if it doesn't exist.
func (s *Store) GetBug(id int) (*models.Bug, error) {
	var bug models.Bug
	err := s.db.View(func(tx *bbolt.Tx) error {
		data := tx.Bucket(bugsBucket).Get(itob(id))
		if data == nil {
			return ErrNotFound
		}
		return json.Unmarshal(data, &bug)
	})
	if err != nil {
		return nil, err
	}
	return &bug, nil
}

// ListBugs returns every bug, ordered by ID ascending.
func (s *Store) ListBugs() ([]*models.Bug, error) {
	bugs := make([]*models.Bug, 0)
	err := s.db.View(func(tx *bbolt.Tx) error {
		return tx.Bucket(bugsBucket).ForEach(func(k, v []byte) error {
			var bug models.Bug
			if err := json.Unmarshal(v, &bug); err != nil {
				return fmt.Errorf("decode bug %x: %w", k, err)
			}
			bugs = append(bugs, &bug)
			return nil
		})
	})
	if err != nil {
		return nil, err
	}
	sort.Slice(bugs, func(i, j int) bool { return bugs[i].ID < bugs[j].ID })
	return bugs, nil
}

// UpdateBug overwrites the mutable fields of an existing bug.
func (s *Store) UpdateBug(id int, input models.BugInput) (*models.Bug, error) {
	var bug models.Bug
	err := s.db.Update(func(tx *bbolt.Tx) error {
		b := tx.Bucket(bugsBucket)
		existing := b.Get(itob(id))
		if existing == nil {
			return ErrNotFound
		}
		if err := json.Unmarshal(existing, &bug); err != nil {
			return fmt.Errorf("decode bug: %w", err)
		}

		bug.Title = input.Title
		bug.Description = input.Description
		bug.Status = input.Status
		bug.Priority = input.Priority
		bug.UpdatedAt = time.Now().UTC()

		data, err := json.Marshal(bug)
		if err != nil {
			return fmt.Errorf("encode bug: %w", err)
		}
		return b.Put(itob(id), data)
	})
	if err != nil {
		return nil, err
	}
	return &bug, nil
}

// DeleteBug removes a bug and cascades the delete to its comments.
func (s *Store) DeleteBug(id int) error {
	return s.db.Update(func(tx *bbolt.Tx) error {
		b := tx.Bucket(bugsBucket)
		if b.Get(itob(id)) == nil {
			return ErrNotFound
		}
		if err := b.Delete(itob(id)); err != nil {
			return fmt.Errorf("delete bug: %w", err)
		}

		c := tx.Bucket(commentsBucket)
		var staleKeys [][]byte
		err := c.ForEach(func(k, v []byte) error {
			var comment models.Comment
			if err := json.Unmarshal(v, &comment); err != nil {
				return fmt.Errorf("decode comment %x: %w", k, err)
			}
			if comment.BugID == id {
				staleKeys = append(staleKeys, append([]byte{}, k...))
			}
			return nil
		})
		if err != nil {
			return err
		}
		for _, k := range staleKeys {
			if err := c.Delete(k); err != nil {
				return fmt.Errorf("delete orphaned comment: %w", err)
			}
		}
		return nil
	})
}

// DeleteAllBugs wipes every bug and comment, resetting both ID sequences,
// and returns how many bugs were removed.
func (s *Store) DeleteAllBugs() (int, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	var count int
	err := s.db.Update(func(tx *bbolt.Tx) error {
		b := tx.Bucket(bugsBucket)
		count = b.Stats().KeyN

		if err := tx.DeleteBucket(bugsBucket); err != nil {
			return fmt.Errorf("reset bugs bucket: %w", err)
		}
		if _, err := tx.CreateBucket(bugsBucket); err != nil {
			return fmt.Errorf("recreate bugs bucket: %w", err)
		}

		if err := tx.DeleteBucket(commentsBucket); err != nil {
			return fmt.Errorf("reset comments bucket: %w", err)
		}
		if _, err := tx.CreateBucket(commentsBucket); err != nil {
			return fmt.Errorf("recreate comments bucket: %w", err)
		}

		meta := tx.Bucket(metaBucket)
		if err := meta.Put(bugSeqKey, itob(0)); err != nil {
			return err
		}
		return meta.Put(commentSeqKey, itob(0))
	})
	return count, err
}
