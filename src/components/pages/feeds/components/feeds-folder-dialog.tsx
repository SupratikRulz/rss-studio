import Dialog, { ConfirmDialog } from "@/components/ui/dialog";

interface FeedsFolderDialogProps {
  showAddFolder: boolean;
  newFolderName: string;
  folderError: string;
  deleteTarget: string | null;
  onCloseAddFolder: () => void;
  onFolderNameChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  onCloseDelete: () => void;
  onConfirmDelete: () => void;
}

export default function FeedsFolderDialog({
  showAddFolder,
  newFolderName,
  folderError,
  deleteTarget,
  onCloseAddFolder,
  onFolderNameChange,
  onSubmit,
  onCloseDelete,
  onConfirmDelete,
}: FeedsFolderDialogProps) {
  return (
    <>
      <Dialog open={showAddFolder} onClose={onCloseAddFolder} title="New Folder">
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="folder-name"
              className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1.5"
            >
              Folder Name
            </label>
            <input
              id="folder-name"
              type="text"
              value={newFolderName}
              onChange={(event) => onFolderNameChange(event.target.value)}
              placeholder="e.g. Technology, News, Science"
              className="w-full rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
              autoFocus
            />
            {folderError && (
              <p className="text-xs text-red-500 mt-1.5">{folderError}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors cursor-pointer"
          >
            Create Folder
          </button>
        </form>
      </Dialog>

      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={onCloseDelete}
        onConfirm={onConfirmDelete}
        title="Delete Folder"
        message="Are you sure you want to delete this folder? Feeds in this folder will be moved to General."
        confirmLabel="Delete"
        variant="danger"
      />
    </>
  );
}
