import { createClient } from "@/lib/supabase/server";
import { serviceRole } from "@/lib/supabase/service-role";
import { NextResponse } from "next/server";

export async function DELETE() {
  try {
    const supabase = await createClient();

    // Get the authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete all user's storage files
    const { data: storageData, error: storageError } = await serviceRole.storage
      .from("packs")
      .list(`${user.id}`);

    if (storageError) {
      console.error("Error listing storage files:", storageError);
      return NextResponse.json(
        { error: "Failed to list storage files" },
        { status: 500 }
      );
    }

    if (storageData.length > 0) {
      const filesToDelete = storageData.map(
        (file) => `${user.id}/${file.name}`
      );
      const { error: deleteError } = await serviceRole.storage
        .from("packs")
        .remove(filesToDelete);

      if (deleteError) {
        console.error("Error deleting storage files:", deleteError);
        return NextResponse.json(
          { error: "Failed to delete storage files" },
          { status: 500 }
        );
      }
    }

    // Delete user's data from all tables
    const tables = ["photos", "packs", "credits"];
    for (const table of tables) {
      const { error: deleteError } = await serviceRole
        .from(table)
        .delete()
        .eq("userId", user.id);

      if (deleteError) {
        console.error(`Error deleting from ${table}:`, deleteError);
        return NextResponse.json(
          { error: `Failed to delete from ${table}` },
          { status: 500 }
        );
      }
    }

    // Finally, delete the user's account
    const { error: deleteUserError } = await serviceRole.auth.admin.deleteUser(
      user.id
    );

    if (deleteUserError) {
      console.error("Error deleting user:", deleteUserError);
      return NextResponse.json(
        { error: "Failed to delete user account" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in delete account route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
