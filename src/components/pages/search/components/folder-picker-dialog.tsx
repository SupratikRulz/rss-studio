import { Loader2, Plus } from "lucide-react";
import Dialog from "@/components/ui/dialog";

interface FolderPickerDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  folders: { id: string; name: string }[];
  folderId: string;
  setFolderId: (value: string) => void;
  showNewFolder: boolean;
  setShowNewFolder: (value: boolean) => void;
  newFolderName: string;
  setNewFolderName: (value: string) => void;
  error: string;
  isSaving: boolean;
  sourceName: string;
}

export default function FolderPickerDialog({
  open,
  onClose,
  onConfirm,
  folders,
  folderId,
  setFolderId,
  showNewFolder,
  setShowNewFolder,
  newFolderName,
  setNewFolderName,
  error,
  isSaving,
  sourceName,
}: FolderPickerDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} title="Choose Folder">
      <div className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-neutral-400">
          Add{" "}
          <span className="font-medium text-gray-900 dark:text-neutral-100">
            {sourceName}
          </span>{" "}
          to a folder:
        </p>

        <div>
          {!showNewFolder ? (
            <div className="flex gap-2">
              <select
                value={folderId}
                onChange={(event) => setFolderId(event.target.value)}
                className="flex-1 rounded-lg border border-gray-200 dark:border-neutral-700 px-3.5 py-2.5 text-sm text-gray-900 dark:text-neutral-100 bg-white dark:bg-neutral-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
              >
                {folders.map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowNewFolder(true)}
                className="flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-neutral-700 px-3 py-2.5 text-sm text-gray-600 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <Plus size={15} />
                New
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={newFolderName}
                onChange={(event) => setNewFolderName(event.target.value)}
                placeholder="New folder name"
                className="flex-1 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                autoFocus
              />
              <button
                type="button"
                onClick={() => {
                  setShowNewFolder(false);
                  setNewFolderName("");
                }}
                className="rounded-lg border border-gray-200 dark:border-neutral-700 px-3 py-2.5 text-sm text-gray-600 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-3 pt-1">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isSaving}
            className="rounded-lg px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Adding...
              </>
            ) : (
              "Follow"
            )}
          </button>
        </div>
      </div>
    </Dialog>
  );
}
