const request = require("supertest");
const express = require("express");

describe("Routes – Unit Tests", () => {
  describe("authRoutes", () => {
    test("should export router", () => {
      const authRoutes = require("../../routes/authRoutes");
      expect(authRoutes).toBeDefined();
    });
  });

  describe("leaveRoutes", () => {
    test("should export router", () => {
      const leaveRoutes = require("../../routes/leaveRoutes");
      expect(leaveRoutes).toBeDefined();
    });
  });

  describe("userRoutes", () => {
    test("should export router", () => {
      const userRoutes = require("../../routes/userRoutes");
      expect(userRoutes).toBeDefined();
    });
  });
});

