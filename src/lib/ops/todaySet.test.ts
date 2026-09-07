import assert from "node:assert/strict";
import { test } from "node:test";
import { getCourt } from "./todaySet.ts";

test("getCourt classifies Ready to lodge as mine", () => {
  assert.equal(getCourt("Ready to lodge"), "mine");
});

test("getCourt classifies Waiting on client and Blocked as theirs", () => {
  assert.equal(getCourt("Waiting on client"), "theirs");
  assert.equal(getCourt("Blocked"), "theirs");
});

test("getCourt classifies active working statuses as mine", () => {
  assert.equal(getCourt("Not started"), "mine");
  assert.equal(getCourt("In progress"), "mine");
  assert.equal(getCourt("For review"), "mine");
});

test("getCourt classifies Done and Not applicable as done", () => {
  assert.equal(getCourt("Done"), "done");
  assert.equal(getCourt("Not applicable"), "done");
});
