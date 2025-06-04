import { checkPasswordHash, getPasswordHash } from "../src/auth/hash.helper"

describe("Argon2 Tests", () => {
	describe("get Password Hash", () => {
		it("should generate a hash for a password", async () => {
			// Arrange
			const password = "TestPassword123!"
			// Act
			const hash = await getPasswordHash(password)
			// Assert
			expect(hash).toBeDefined()
			expect(typeof hash).toBe("string")
			expect(hash.length).toBeGreaterThan(20) // Argon2 hashes are typically long
			expect(hash).toContain("$argon2") // Argon2 hash format identifier
		})

		it("should generate different hashes for the same password", async () => {
			// Arrange
			const password = "TestPassword123!"
			// Act
			const hash1 = await getPasswordHash(password)
			const hash2 = await getPasswordHash(password)
			// Assert
			expect(hash1).not.toEqual(hash2) // Hashes should contain different salts
		})
	})

	describe("check Password Hash", () => {
		it("should return true for correct password", async () => {
			// Arrange
			const password = "TestPassword123!"
			const hash = await getPasswordHash(password)

			// Act
			const result = await checkPasswordHash(password, hash)

			// Assert
			expect(result).toBe(true)
		})

		it("should return false for incorrect password", async () => {
			// Arrange
			const password = "TestPassword123!"
			const wrongPassword = "WrongPassword123!"
			const hash = await getPasswordHash(password)

			// Act
			const result = await checkPasswordHash(wrongPassword, hash)

			// Assert
			expect(result).toBe(false)
		})

		it("should handle empty password correctly", async () => {
			// Arrange
			const password = ""
			const hash = await getPasswordHash(password)

			// Act
			const result = await checkPasswordHash(password, hash)

			// Assert
			expect(result).toBe(true)
		})
	})
})
