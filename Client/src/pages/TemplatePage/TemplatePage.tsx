import React, { useState } from 'react';
import TemplateModal from './Components/TemplateModal';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import CreateTemplateModal from './Components/CreateTemplateModal';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import {
  createNewTemplate,
  deleteTemplate,
  updateTemplate,
} from '../../services/templatePageService';
import EditTemplateModal from './Components/EditTemplateModal';
import { WorkoutTemplate } from '../../types/Templatetypes';
import LoadingOverlay from '../../Components/LoadingOverlay';
import ModalPopup from '../../Components/ModalPopUp';
import ModalPopupSubmit from '../../Components/ModalPopUpSubmit';
import { motion } from 'framer-motion';

type templateProps = {
  templates: WorkoutTemplate[];
};

const TemplatePage: React.FC<templateProps> = ({
  templates,
}: templateProps) => {
  const [selectedTemplate, setSelectedTemplate] =
    useState<WorkoutTemplate | null>(null);
  const [editTemplate, setEditTemplate] = useState<WorkoutTemplate | null>(
    null,
  );
  const [delTemplate, setDeleteTemplate] = useState<WorkoutTemplate | null>(
    null,
  );
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [isBusy, setIsBusy] = useState(false);
  const [popUp, setPopUp] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleEditTemplate = (
    e: React.MouseEvent,
    template: WorkoutTemplate,
  ) => {
    e.stopPropagation();
    setShowEditModal(true);
    setEditTemplate(template);
  };

  return (
    <div className="pb-16 bg-gradient-to-b from-gray-100 to-white md:pt-20 md:pb-0">
      <div className="min-h-screen from-white to-blue-50 py-10 px-4">
        <div className="max-w-6xl mx-auto space-y-10">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl text-blue-700 font-bold">
              Workout Templates
            </h1>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white font-medium px-3 py-2 rounded-md shadow-sm hover:bg-blue-700 transition flex items-center justify-center gap-2 text-sm sm:text-base w-half sm:w-auto"
            >
              <FiPlus className="text-sm sm:text-base" />
              <span className="truncate">Create Template</span>
            </button>
          </div>

          {/* Template Previews */}
          {templates.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              <p className="text-lg font-medium">No templates yet</p>
              <p className="text-sm">
                Click &quot;Create Template&quot; to get started
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <motion.div
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 cursor-pointer hover:shadow-xl transition relative group"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {template.templateData.name}
                  </h2>
                  <p className="text-sm text-blue-600">
                    {template.templateData.exercises.length} exercises •{' '}
                    {template.templateData.exercises.reduce(
                      (acc, ex) => acc + ex.sets.length,
                      0,
                    )}{' '}
                    sets
                  </p>

                  {/* Edit & Delete Icons */}
                  {!(template.id >= 1 && template.id <= 8) && (
                    <div
                      className="absolute top-3 right-3 flex gap-3
                                opacity-100
                                sm:opacity-0 sm:group-hover:opacity-100
                                transition-opacity"
                    >
                      <button
                        onClick={(e) => handleEditTemplate(e, template)}
                        className="text-gray-600 hover:text-blue-600 active:scale-95 transition-transform"
                        title="Edit"
                      >
                        <FiEdit className="text-xl" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteTemplate(template);
                        }}
                        className="text-gray-600 hover:text-red-500 active:scale-95 transition-transform"
                        title="Delete"
                      >
                        <FiTrash2 className="text-xl" />
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        {selectedTemplate && (
          <TemplateModal
            selectedTemplate={selectedTemplate.templateData}
            setSelectedTemplate={setSelectedTemplate}
          />
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <CreateTemplateModal
          onClose={() => setShowCreateModal(false)}
          onSave={(templateData) => {
            createNewTemplate(templateData, dispatch, setIsBusy, setPopUp);
          }}
        />
      )}
      {/* Create Modal */}
      {showEditModal && editTemplate && (
        <EditTemplateModal
          template={editTemplate!}
          onClose={() => setShowEditModal(false)}
          onSave={(templateData: WorkoutTemplate) => {
            updateTemplate(templateData, dispatch, setIsBusy, setPopUp);
          }}
        />
      )}
      {popUp && (
        <ModalPopup
          title="Error"
          message="Error in updating the Template."
          onClose={() => setPopUp(false)}
        />
      )}
      {delTemplate && (
        <ModalPopupSubmit
          title="Delete Workout"
          message="Are you sure? This workout will be permanently removed."
          onClose={() => setDeleteTemplate(null)}
          onSubmit={() =>
            deleteTemplate(
              delTemplate.id,
              dispatch,
              setIsBusy,
              setPopUp,
              setDeleteTemplate,
            )
          }
        />
      )}
      {isBusy && <LoadingOverlay />}
    </div>
  );
};

export default TemplatePage;
