Review the current requirements or code and produce an implementation contract for the requested changes. Do not implement anything.

The contract must be designed for another coding model to execute with minimal interpretation. Do not combine all work into one large milestone.

For every proposed milestone, provide:

1. Scope boundary
   - Exactly what is included.
   - Exactly what is deferred.
   - Maximum files or subsystems expected to change.
   - Dependencies that must already be stable.

2. Current-code diagnosis
   - Identify the specific functions, routes, tables, JavaScript handlers, CSS states, and existing tests involved.
   - Explain which existing behavior must be replaced or deleted.
   - Flag duplicate or legacy implementations that could conflict.

3. State model
   - List every permitted state and transition.
   - Provide a transition table containing starting state, user action, database changes, resulting state, and UI result.
   - Explicitly define undo, retry, double-click, stale-page, and failed-request behavior.

4. Database invariants
   - State rules that must always remain true.
   - Define transaction boundaries.
   - Define idempotency requirements.
   - Explain how existing invalid local data will be repaired safely.
   - Specify what historical data must never be rewritten.

5. Backend contracts
   - For every affected route, specify request fields, validation, database operation, response, and error behavior.
   - Prefer explicit desired-state commands over non-idempotent toggles.
   - State which legacy routes should be removed or redirected.

6. Frontend interaction contract
   - Identify the exact clickable and draggable surfaces.
   - State which elements must be inert.
   - Define drag start, valid target highlighting, drop, cancellation, failure recovery, refresh, and scroll restoration.
   - Define how listeners remain functional after repeated actions.

7. Scenario matrix
   Include exact Given/When/Then scenarios for:
   - First use.
   - Repeated use.
   - Same-date events.
   - Dragging a plant to an occupied date.
   - Dragging a group to an occupied date.
   - Watering today, in the past, and in the future.
   - Undoing, moving, and recording again.
   - Double-clicks and repeated requests.
   - Forecast coverage ending before the next recurrence.
   - Existing malformed or duplicated occurrence state.
   - Month boundaries and the six-month horizon.

8. Automated tests
   - Name the test module and proposed test for every scenario.
   - Identify existing tests that encode rejected behavior and must be replaced.
   - Do not treat the current passing suite as sufficient evidence.

9. Manual browser script
   - Provide an exact numbered desktop walkthrough using realistic plant data.
   - Require at least five consecutive drags and several water/undo cycles without reloading manually.
   - Include expected visible results and database assertions.
   - Require checking that the viewport does not jump.

10. Milestone gates
   - Each milestone must finish with focused tests, the complete test suite, syntax checks, diff review, and relevant browser verification.
   - The executor must stop after each milestone and report evidence before starting the next.
   - Styling and documentation must not begin until behavioral milestones pass.

11. Ambiguities
   - List every unresolved product decision.
   - Recommend a default, but do not silently choose behavior that changes history or data semantics.

End with a concise execution prompt for the coding model covering only the first milestone.