export default function VoiceFeedback() {
  return (
    <div className="fixed bottom-24 left-0 right-0 flex justify-center pointer-events-none z-50">
      <div className="bg-primary-900 bg-opacity-90 text-white rounded-full px-4 py-2 flex items-center shadow-lg">
        <i className="fas fa-microphone text-primary-200 mr-2"></i>
        <span className="text-sm font-medium">Listening...</span>
      </div>
    </div>
  );
}
