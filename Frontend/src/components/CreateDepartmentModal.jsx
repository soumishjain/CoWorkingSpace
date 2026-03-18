import React from "react";

const CreateDepartmentModal = ({
  formData,
  onChange,
  onSubmit,
  loading,
  setOpen
}) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

      <div className="bg-white p-6 rounded-xl w-96">

        <h2 className="text-lg font-semibold mb-4">
          Create Department
        </h2>

        <form onSubmit={onSubmit} className="space-y-4">

          <input
            name="name"
            value={formData.name}
            onChange={onChange}
            placeholder="Department Name"
            className="w-full border p-2 rounded"
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={onChange}
            placeholder="Description"
            className="w-full border p-2 rounded"
          />

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-gray-500"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default CreateDepartmentModal;