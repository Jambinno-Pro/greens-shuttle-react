import dotenv from "dotenv";

dotenv.config();

/* =========================================================
   GET GOOGLE REVIEWS
========================================================= */

export const getGoogleReviews = async (req, res) => {
  try {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    const placeId = process.env.GOOGLE_PLACE_ID;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: "Google Places API key is not configured.",
      });
    }

    if (!placeId) {
      return res.status(500).json({
        success: false,
        message: "Google Place ID is not configured.",
      });
    }

    const url =
      `https://places.googleapis.com/v1/places/${placeId}` +
      `?fields=displayName,rating,userRatingCount,reviews` +
      `&key=${apiKey}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "displayName,rating,userRatingCount,reviews",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Google Places API error:", data);

      return res.status(response.status).json({
        success: false,
        message: "Unable to retrieve Google reviews.",
        error: data.error?.message || "Google Places API error.",
      });
    }

    const reviews = (data.reviews || []).map((review) => ({
      author: review.authorAttribution?.displayName || "Google User",

      authorPhoto: review.authorAttribution?.photoUri || "",

      rating: review.rating || 0,

      text: review.text?.text || review.originalText?.text || "",

      relativeTime: review.relativePublishTimeDescription || "",

      publishTime: review.publishTime || "",
    }));

    return res.json({
      success: true,

      business: {
        name: data.displayName?.text || "Greens Shuttle",
        rating: data.rating || 0,
        reviewCount: data.userRatingCount || 0,
      },

      reviews,
    });
  } catch (error) {
    console.error("Google reviews controller error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while loading Google reviews.",
    });
  }
};
