/// <reference types="cypress" />

import LoginPage from "../../pages/loginPage"
import InventoryPage from "../../pages/inventoryPage";
import CheckoutPage from "../../pages/checkoutPage";
const loginPage = new LoginPage()
const inventoryPage = new InventoryPage()
const checkoutPage = new CheckoutPage()

describe("sauce demo login tests", () => {

    it ("verifies that a user is able to correctly login to the site", () => {
        loginPage.login("standard_user", "secret_sauce");
        cy.url().should('eq', 'https://www.saucedemo.com/v1/inventory.html');
        inventoryPage.logoutLinkVisible();
    });

    it ("verifies that a user can logout", () => {
        loginPage.login("standard_user", "secret_sauce");
        inventoryPage.clickLogutButton();
        cy.url().should('eq', 'https://www.saucedemo.com/v1/index.html');
    });


    it ("verifies that a user is not able to login with invalid credentials", () => {
        loginPage.login("test", "test");
        loginPage.errorMessage().should("have.text","Epic sadface: Username and password do not match any user in this service");
      });

    it ("verifies that a locked out user is not able to login with valid credentials", () => {
        loginPage.login("locked_out_user", "secret_sauce");
        loginPage.errorMessage().should("have.text","Epic sadface: Sorry, this user has been locked out.");
      });

    it ("verifies that a valid (performance_glitch_user) user can log-in with the valid credentials, but with long timeout", () => {
        loginPage.login("performance_glitch_user", "secret_sauce");
        cy.wait(10000);
        cy.url().should('include', '/inventory.html');
        inventoryPage.logoutLinkVisible();
      });

      it ("verifies that a user is able to correctly add an item to the cart", () => {
        loginPage.login("standard_user", "secret_sauce");
        inventoryPage.addItemToShoppingCart('Sauce Labs Bike Light');
        inventoryPage.clickShoppingCartIcon();
        cy.get('.inventory_item_name').should('have.text', 'Sauce Labs Bike Light');
        cy.get('.inventory_item_price').should('contain', '9.99');
        cy.get('.btn_action.checkout_button').should('be.visible');

      });

      it ("verifies that a user can buy an item from the item list", () => {
        // User login
        loginPage.login("standard_user", "secret_sauce");
        // Add item to shopping cart and verify Item Name and Item Price
        inventoryPage.addItemToShoppingCart('Sauce Labs Bike Light');
        inventoryPage.clickShoppingCartIcon();
        cy.get('.inventory_item_name').should('have.text', 'Sauce Labs Bike Light');
        cy.get('.inventory_item_price').should('contain', '9.99');
        // Proceed to checkout
        cy.get('.btn_action.checkout_button').click();
        checkoutPage.checkout("nat", "pet", 1000);
        checkoutPage.clickFinishButton();
        // Verify successful purchase
        checkoutPage.successMessage('THANK YOU FOR YOUR ORDER');
      });

      it ("verifies that a user can login when screen width is less than 1060px", () => {
        loginPage.visit()
        cy.viewport(1050, 600);
        // Assert that the viewport width is set as expected
        cy.window().then((win) => {
          expect(win.innerWidth).to.eq(1050);
        });
        loginPage.fillUsername("standard_user");
        loginPage.fillPassword("secret_sauce");
        loginPage.clickLoginButton();
        cy.url().should('include', '/inventory.html');
        inventoryPage.logoutLinkVisible();
    });

});