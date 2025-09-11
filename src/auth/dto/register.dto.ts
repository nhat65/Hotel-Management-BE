import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  Matches,
  IsEnum,
  IsUUID,
} from 'class-validator';
import { AccountRole } from 'src/constants/enum';

export class RegisterDto {
  @IsNotEmpty({ message: 'Username must not be empty' })
  @MinLength(4, { message: 'Username must be at least 4 characters' })
  username: string;

  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @Matches(
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    {
      message:
        'Password must contain uppercase, lowercase, number, and special character',
    },
  )
  password: string;

  @IsNotEmpty({ message: 'Confirm password must not be empty' })
  confirmPassword: string;

  @IsEnum(AccountRole, { message: 'Role not valid' })
  @IsNotEmpty({ message: 'Role must not be empty' })
  role: AccountRole;

  @IsNotEmpty({ message: 'Staff id must not be empty' })
  @IsUUID('4', { message: 'ID must be a UUID' })
  staffId: string;
}
