import { motion } from 'framer-motion';

interface ModalPopupSubmitProps {
  title: string;
  message: string;
  onClose: () => void;
  onSubmit: () => void;
}

const ModalPopupSubmit: React.FC<ModalPopupSubmitProps> = ({
  title,
  message,
  onClose,
  onSubmit,
}: ModalPopupSubmitProps) => {
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-gray-100 p-6 rounded-lg shadow-lg w-[90%] max-w-md text-center">
        <h2 className="text-xl font-semibold text-blue-600 mb-2">{title}</h2>
        <p className="text-gray-700 text-lg mb-4">{message}</p>

        <div className="flex justify-center gap-4">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={onSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ModalPopupSubmit;
