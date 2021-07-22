import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { RecipeService } from "../recipes/recipe.service";
import { Recipe } from '../recipes/recipe.model';
import { map, tap } from "rxjs/operators";

@Injectable({providedIn: 'root'})
export class DataStorageService {
  constructor(private http: HttpClient, private recipesService: RecipeService) {}

  storeRecipes() {
    const recipes = this.recipesService.getRecipes();
    this.http
      .put(
        'https://ng-course-recipe-book-10e18-default-rtdb.firebaseio.com/recipes.json', 
        recipes
      )
      .subscribe(response => {
        console.log(response);
    });
  }

  fetchResipes() {
    return this.http
      .get<Recipe[]>(
        'https://ng-course-recipe-book-10e18-default-rtdb.firebaseio.com/recipes.json'
        )
      .pipe(
        map(recipes => {
          return recipes.map(recipe => {
            return {
              ...recipe, 
              ingredients: recipe.ingredients ? recipe.ingredients : []
            };
          });
        }),
        tap(recipes => {
          this.recipesService.setRecipes(recipes);
        })
      )
  }
}