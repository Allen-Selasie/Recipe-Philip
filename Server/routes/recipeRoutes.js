const express = require("express");
const recipeRouter = express.Router();
const Recipe = require("../models/recipe");

// Route for adding engagement to a recipe
recipeRouter.post("/engage/:recipeId", async (req, res) => {
  try {
    const { recipeId } = req.params;
    const { engagementType, comment, rating } = req.body; // Expect engagementType, and optionally comment or rating
    const userId = req.session.user._id; // Assume user ID is available in the req.user after authentication

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const options = {};
    if (comment) options.comment = comment;
    if (rating) options.rating = rating;

    const Recipe_update = await recipe.addEngagement(
      engagementType,
      userId,
      options
    );
    //console.log(Recipe_update);

    res
      .status(200)
      .json({
        message: "Engagement added successfully",
        success: true,
        Recipe_update,
      });
  } catch (error) {
    console.error("Error adding engagement:", error);
    res
      .status(500)
      .json({ message: "Failed to add engagement", error: error.message });
  }
});
recipeRouter.get('/feed',async(req,res)=>{

    const recipes = await Recipe.getFeed();
    
    res.render("feed",{recipes});
})

recipeRouter.get("/comments/:recipeId", async (req, res) => {
  try {
    const { recipeId } = req.params;
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }else{
        //console.log(`(recipe found)`);
    }

  
    const comments = await recipe.getComments(recipeId);

    res.status(200).json({ comments, success: true });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch comments", error: error.message });
  }
});

recipeRouter.get("/:recipeId", async (req, res) => {
  try {
    const { recipeId } = req.params;
    const recipe = await Recipe.findById(recipeId).populate('author');

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.render("viewRecipe", { recipe });
  } catch (error) {
    console.error("Error adding comment:", error);
    res
      .status(500)
      .json({ message: "Failed to add comment", error: error.message });
  }
});



module.exports = recipeRouter;
