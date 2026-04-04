import { useUser } from "@clerk/nextjs";

interface UserAvatarProps {
  size: number;
}

export default function UserAvatar({ size }: UserAvatarProps) {
  const { user } = useUser();

  if (!user?.imageUrl) {
    return null;
  }

  return (
    <img
      src={user.imageUrl}
      alt={user.fullName ?? "User avatar"}
      width={size}
      height={size}
      className="rounded-full"
      referrerPolicy="no-referrer"
    />
  );
}
