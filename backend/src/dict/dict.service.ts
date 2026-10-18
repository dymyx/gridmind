import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class DictService {
  constructor(private readonly prisma: PrismaService) {}

  // # TEAMS ------------------------------------------

  /**
   * Метод для получения всех команд
   * @returns
   */
  getAllTeams() {
    return this.prisma.team.findMany();
  }

  /**
   * Метод для получения определенной команды по ее ID
   * @param id - айди команды
   * @returns
   */
  getTeamByID(id: string) {
    return this.prisma.team.findUnique({ where: { id } });
  }

  /**
   * Метод для получения определенной команды по ее названию
   * @param team_name - название команды
   * @returns
   */
  getTeamByName(team_name: string) {
    return this.prisma.team.findFirstOrThrow({ where: { name: team_name } });
  }

  // # DRIVERS ------------------------------------------

  /**
   * Метод для получения всех пилотов
   * @returns
   */
  getAllDrivers() {
    return this.prisma.driver.findMany();
  }

  /**
   * Метод для получения пилота по его ID
   * @param id
   * @returns
   */
  getDriverByID(id: string) {
    return this.prisma.driver.findUnique({ where: { id } });
  }

  /**
   * Метод для получения пилота/ов по его номеру.
   * @param number
   * @returns
   */
  getDriversByNumber(number: number) {
    return this.prisma.driver.findMany({ where: { number } });
  }

  // # CIRCUITS -------------------------------------------------

  /**
   * Метод для получения всех трасс.
   * Без фильтра возвращает все трассы
   * @returns массив трасс
   */
  getCircuits(filters: { country?: string; city?: string }) {
    const { country, city } = filters;

    return this.prisma.circuit.findMany({
      where: {
        country: country ? { equals: country, mode: 'insensitive' } : undefined,
        city: city ? { equals: city, mode: 'insensitive' } : undefined,
      },
    });
  }

  /**
   * Метод для получения трассы по ID
   * @param id - айди трассы
   * @returns трасса или null
   */
  getCircuitByID(id: string) {
    return this.prisma.circuit.findUnique({ where: { id } });
  }

  /**
   * Метод для получения трасс по стране
   * @param country - страна
   * @returns
   */
  getCircuitByCountry(country: string) {
    return this.prisma.circuit.findMany({ where: { country } });
  }

  /**
   * Метод для получения трасс по городу
   * @param city - город
   * @returns
   */
  getCircuitByCity(city: string) {
    return this.prisma.circuit.findMany({ where: { city } });
  }

  // # SEASONS -------------------------------------------------

  getAllSeasons() {
    return this.prisma.season.findMany();
  }

  getSeasonByYear(year: number) {
    return this.prisma.season.findFirstOrThrow({ where: { year } });
  }
}
