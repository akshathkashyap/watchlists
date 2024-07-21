import axios, { AxiosInstance, AxiosResponse } from "axios";
import { IMovie, IMovieDetailed } from "@/components/Movie";

class Requester {
	private apikey: string = process.env.API_KEY ?? "fe7c9e26";
	private apiBaseUrl: string = "https://www.omdbapi.com/";
	private axiosInstance: AxiosInstance;

	constructor() {
		this.axiosInstance = axios.create({
			baseURL: this.apiBaseUrl,
			headers: {
				"Content-Type": "application/json"
			},
		});
	}

	private async makeRequest(params: Record<string, string | number>) {
		let response: AxiosResponse;
		const config = {
			params: { apikey: this.apikey, ...params },
		};

		try {
			response = await this.axiosInstance.get("", config);
			return response;
		} catch (error) {
			console.error(error);
			return null;
		}
	}

	public async getMovieById(id: string): Promise<IMovieDetailed> {
		const response = await this.makeRequest({
			i: id,
		});

		if (!response) throw new Error("no response from api");

		const responseData = response.data;
		if (Object.keys(responseData).includes("Error")) {
			throw responseData.Error;
		}

		const movie: IMovieDetailed = {
			id: responseData.imdbID,
			poster: responseData.Poster,
			title: responseData.Title,
			year: responseData.Year,
			rating: responseData.imdbRating,
			released: responseData.Released,
			runtime: responseData.Runtime,
			genre: responseData.Genre,
			actors: responseData.Actors.split(", "),
			plot: responseData.Plot,
		};

		return movie;
	}

	public async getMoviesBySearchString(searchString: string, pageNumber = 1): Promise<IMovie[]> {
		const response = await this.makeRequest({
			s: searchString,
			page: pageNumber
		});

		if (!response) return [];

		const responseData = response.data;
		if (Object.keys(responseData).includes("Error")) {
			throw responseData.Error;
		}

		const movies: IMovie[] = responseData.Search.map((movie: any) => {
			return {
				id: movie.imdbID,
				poster: movie.Poster,
				title: movie.Title,
				year: movie.Year
			};
		});

		return movies;
	}
}

export default Requester;
