import * as userQueries from "../db/user.queries";
import { AppError } from "../error/errorHandler";

export const getCurrentUser = async (id: string) => {
  const currentUser = await userQueries.getUserById(id);

  if (!currentUser || currentUser.deletedAt) {
    throw new AppError("User doesn't exist", 404);
  }

  return currentUser;
};

export const updateCurrentUser = async (
  id: string,
  body: { name: string; username: string; bio: string; avatar: string },
) => {
  const { name, username, avatar } = body;
  const currentUser = await userQueries.getUserById(id);

  if (!currentUser || currentUser.deletedAt) {
    throw new AppError("User doesn't exist", 404);
  }

  const normalizedUsername = username?.trim().toLowerCase();

  if (normalizedUsername && normalizedUsername !== currentUser.username) {
    const existingUser =
      await userQueries.getUserByUsername(normalizedUsername);
    if (existingUser) {
      throw new AppError("Username is already taken", 400);
    }
  }

  const values = {
    ...(name && { name: name.trim() }),
    ...(normalizedUsername && { username: normalizedUsername }),
    ...(avatar && { avatar }),
  };

  if (Object.keys(values).length === 0) {
    throw new AppError("No fields provided for update", 400);
  }

  const updatedUser = await userQueries.updateUser(id, values);

  return updatedUser;
};

export const deleteCurrentUser = async (id: string) => {
  const currentUser = await userQueries.getUserById(id);

  if (!currentUser || currentUser.deletedAt) {
    throw new AppError("User doesn't exist", 404);
  }

  const deletedUser = await userQueries.deleteUser(id);

  return deletedUser;
};
