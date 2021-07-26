interface DisplayErrorMessageInput {
  error: any;
}

export const ErrorMessage = ({ error }: DisplayErrorMessageInput) => {
  if (!error || !error.message) return null;
  return (
    <div className="mx-auto bg-red-600 p-3 rounded-md text-center shadow-lg">
      <p className="text-sm font-bold font-serif text-gray-300">
        {" "}
        Error: {error.message}
      </p>
    </div>
  );
};
