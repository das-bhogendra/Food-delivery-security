describe("Food Items Page Test", () => {
  it("should display food items", () => {
    cy.visit("/user/dashboard/food");

    
    cy.get("body").should("contain", "Our Menu");
    
    
    cy.get("button").contains("Add +").should("exist");
  });

  it("should add food item to cart", () => {
    cy.visit("/user/dashboard/food");

    // Wait for page to load
    cy.get("body").should("contain", "Our Menu");
    
    
    cy.contains("Add +").first().click();
  });
});

