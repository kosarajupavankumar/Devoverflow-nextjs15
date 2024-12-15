import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import ROUTES from '@/app/constants/routes';

import { Avatar , AvatarFallback} from './ui/avatar';

interface props {
  id: string;
  name: string;
  imageUrl?: string | null;
  className?: string | undefined;
}

const UserAvatar = ({ id, name, imageUrl, className = 'h-9 w-9' } : props) => {
    const initials = name.split(' ').map((word : string) => word[0]).join('').toUpperCase().slice(0, 2);

  return (
    <Link href={ROUTES.PROFILE(id)}>
      <Avatar className={className}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            className="object-cover"
            width={36}
            height={36}
            quality={100}
          ></Image>
        ) : (
        <AvatarFallback className='primary-gradient font-space-grotesk font-bold tracking-wide text-white'>
            {initials}
            </AvatarFallback>
        )}
      </Avatar>
    </Link>
  );
};

export default UserAvatar;
