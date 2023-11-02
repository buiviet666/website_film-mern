import responseHandler from "../handlers/response.handler";
import tmdbApi from "../tmdb/tmdb.api";
import userModel from "../models/favorite.model";
import favoriteModel from "../models/favorite.model";
import reviewModel from "../models/review.model";
import tokenMiddleware from "../middlewares/token.middleware";

const getList = async (req, res) => {
    try {
        const { page } = req.query;

        const { mediaType, mediaCategory } = req.params;

        const response = await tmdbApi.mediaList({ mediaType, mediaCategory, page });

        return responseHandler.ok(res, response);
    } catch {
        responseHandler.error(res);
    }
};

const getGenres = async (req, res) => {
    try {
        const { mediaType } = req.params;

        const response = await tmdbApi.mediaGenres({ mediaType });

        return responseHandler.ok(res, response);
    } catch {
        responseHandler.error(res);
    }
};

const search = async (req, res) => {
    try {
        const { mediaType } = req.params;

        const { query, page } = req.query;

        const response = await tmdbApi.mediaSearch({
            query,
            page,
            mediaType: mediaType === "people" ? "person" : mediaType
        });

        responseHandler.ok(res, response);
    } catch {
        responseHandler.error(res);
    }
};

const getDetail = async (req, res) => {
    try {
        const { mediaType, mediaId } = res.params;

        const params = { mediaType, mediaId };

        const media = await tmdbApi.mediaDetail(params);

        media.creadits = await tmdbApi.mediaCredits(params);

        const videos = await tmdbApi.mediaVideos(params);
        media.videos = videos;

        const recommend = await tmdbApi.mediaRecommend(params);
        media.recommend = recommend.results;

        media.images = await tmdbApi.mediaImages(params);

        const tokenDecoded = tokenMiddleware.tokenDecode(req);

        if (tokenDecoded) {
            const user = await userModel.findById(tokenDecoded.data);
            if (user) {
                const isFavorite = await favoriteModel.findOne({ user: user.id, mediaId });
                media.isFavorite = isFavorite !== null;
            }
        }

        media.reviews = await reviewModel.find({ mediaId }).popular("user").sort("-createAt");

        responseHandler.ok(res, media);
    } catch {
        responseHandler.error(res);
    }
};

export default {
    getList,
    getGenres,
    search,
    getDetail
};