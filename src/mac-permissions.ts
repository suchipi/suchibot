import makeDebug from "debug";
const debug = makeDebug("suchibot:mac-permissions");

export async function requestPermissions() {
  // @ts-ignore not present on non-mac
  const permissions: typeof import("@suchipi/node-mac-permissions") = require("@suchipi/node-mac-permissions");

  const inputMonitoringPermission =
    permissions.getAuthStatus("input-monitoring");

  debug("Input monitoring status: %s", inputMonitoringPermission);

  if (inputMonitoringPermission !== "authorized") {
    console.warn(
      `Warning: Input monitoring access was: ${inputMonitoringPermission}. Requesting access.`
    );
    await permissions.askForInputMonitoringAccess();
  }

  const accessibilityPermission = permissions.getAuthStatus("accessibility");

  debug("Accessibility access status: %s", accessibilityPermission);

  if (accessibilityPermission !== "authorized") {
    console.warn(
      `Warning: Accessibility access was: ${accessibilityPermission}. Opening preference pane; please grant access.`
    );
    permissions.askForAccessibilityAccess();
  }
}
