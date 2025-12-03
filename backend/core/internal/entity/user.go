package entity

type User struct {
	ID                   string
	Username             string
	Password             string
	Verified             bool
	VerificationAttempts uint8
	VerificationTime     int64
	CreatedAt            int64
	UpdatedAt            int64
}

// somewhere here should be a hook for encrypting/verifying the password
