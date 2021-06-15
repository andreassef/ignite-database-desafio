import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;
  private userRepo: Repository<User>;

  constructor() {
    this.repository = getRepository(Game);
    this.userRepo = getRepository(User)
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return await this.repository
      .createQueryBuilder("games").where("LOWER(games.title) LIKE LOWER(:param)",
       {param: `%${param}%`})
       .getMany();
      // Complete usando query builder
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return await this.repository.query("SELECT count(*) FROM games;"); // Complete usando raw query
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const users = await this.repository.createQueryBuilder("games")
    .leftJoinAndSelect("games.users", "users")
    .where("games.id = :id", {id})
    .getOneOrFail();
    const getUsers = users?.users;
    return getUsers;
  }
}
