export default function AuthDivider() {
  return (
    <div className="flex items-center justify-center">
      <div className="border-t border-gray-300 w-full mr-3" />
      <span className="text-sm text-gray-500">or</span>
      <div className="border-t border-gray-300 w-full ml-3" />
    </div>
  );
}
// components/AuthDivider.tsx
// This component renders a horizontal divider with "or" text in the middle.
// It uses Tailwind CSS for styling, creating a clean and modern look for the authentication form.
// The divider is useful for separating different authentication methods, such as email/password and social logins.