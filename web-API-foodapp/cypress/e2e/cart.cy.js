describe("Cart Page Test", () => {
  it("should display items in cart", () => {
    // First add an item to cart by visiting food page
    cy.visit("/user/dashboard/food");

    // Wait for page to load
    cy.get("body").should("contain", "Our Menu");
    
    // Add first item to cart
    cy.contains("Add +").first().click();

    // Navigate to cart page
    cy.visit("/user/dashboard/cart");

    // Wait for cart page to load
    cy.get("body").should("contain", "Your Cart");
    
    // Check for cart items - look for any element containing the item name or price
    // The cart item can be identified by various elements
    cy.get("body").should("not.contain", "Your cart is empty");
  });
});

