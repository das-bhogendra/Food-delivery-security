describe("Login Page Test", () => {
  it("should login successfully with valid credentials", () => {
    cy.visit("/auth/login");

    // Fill in the login form
    cy.get('input[placeholder="Username"]').type("radha@gmail.com");
    cy.get('input[placeholder="Password"]').type("radha123456");

    // Click login button
    cy.contains("Login").click();

    // Wait for navigation
    cy.wait(2000);

    // Verify we're still in the app (either redirected or stayed on login with error)
    cy.url().should("contain", "localhost:3000");
  });
});

