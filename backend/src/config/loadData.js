import fs from 'fs'
import csv from 'csv-parser'

/**
 *
 */
export class LoadDataService {
  /**
   * Parses csv.
   *
   * @param {string} filePath path to the csv files.
   */
  parseCSV (filePath) {
    return new Promise((resolve, reject) => {
      const results = []
      fs.createReadStream(filePath)
        .pipe(csv({ separator: ';' }))
        .on('data', (data) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', (error) => reject(error))
    })
  }

  /**
   * Loads the data from the csv files.
   *
   */
  async loadDatasets () {
    try {
      const moviesRaw = await this.parseCSV('./src/data/movies.csv')
      const ratingsRaw = await this.parseCSV('./src/data/ratings.csv')
      const usersRaw = await this.parseCSV('./src/data/users.csv')

      this.movies = moviesRaw.map(m => ({
        MovieId: parseInt(m.MovieId, 10),
        Title: m.Title,
        Year: parseInt(m.Year, 10)
      }))

      this.ratings = ratingsRaw.map(r => ({
        UserId: parseInt(r.UserId, 10),
        MovieId: parseInt(r.MovieId, 10),
        Rating: parseFloat(r.Rating)
      }))

      this.users = usersRaw.map(u => ({
        UserId: parseInt(u.UserId, 10),
        Name: u.Name
      }))

      console.log(this.users)
    } catch (error) {
      console.error('Error loading datasets:', error)
      throw error
    }
  }
}
