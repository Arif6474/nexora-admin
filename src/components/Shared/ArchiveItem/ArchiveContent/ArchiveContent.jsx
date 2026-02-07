import ArchiveButtons from "./ArchiveButtons/ArchiveButtons";

function ArchiveContent({ targetID, handleArchive, setShowArchiveModal, isActive, text }) {
  return (
    <div className="delete_content">
      <h1 className="text-center">Are you sure?</h1>
      <p className="py-2 text-center">Please confirm you want to {isActive ? 'archive' : 'unarchive'} this {text ? text : "item"}.</p>
      <ArchiveButtons
        isActive={isActive}
        targetID={targetID}
        handleArchive={handleArchive}
        setShowArchiveModal ={setShowArchiveModal}
      />
    </div>
  );
}

export default ArchiveContent;
