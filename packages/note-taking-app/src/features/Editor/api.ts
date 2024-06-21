import { User } from './types';

export async function searchUsers(query: string): Promise<User[]> {
  const users: User[] = [
    {
      first_name: 'John',
      last_name: 'Doe',
      username: 'johndoe'
    },
    {
      first_name: 'Jane',
      last_name: 'Doe',
      username: 'janedoe'
    }
  ];
  const lcQuery = query.toLowerCase();

  return users
    .sort(({ first_name: a }, { first_name: b }) => a.localeCompare(b))
    .filter(({ username, first_name, last_name }) => {
      const fullName = `${first_name} ${last_name}`;

      return !lcQuery
        || [username, first_name, last_name, fullName].some((str) => str.startsWith(lcQuery));
    })
    .slice(0, 5);
}
