from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.metrics import pairwise_distances
from sklearn.preprocessing import MinMaxScaler
import random

app = Flask(__name__)

def recommendation_sys(user,inputArray):
 # Read dataset
 data_file = inputArray
 df = pd.DataFrame(data_file)

 # Create user-product rating matrix
 rating_matrix = df.pivot_table(index='user_id', columns='product_id', values='rating').fillna(0)

 # Calculate user similarity using cosine similarity
 user_similarity = cosine_similarity(rating_matrix)
 user_similarity = pd.DataFrame(user_similarity, index=rating_matrix.index, columns=rating_matrix.index)

 # Function to predict ratings
 def predict_ratings(user_id, top_n=5):
    similar_users = user_similarity[user_id].sort_values(ascending=False).iloc[1:]
    user_ratings = rating_matrix.loc[user_id]
    rated_products = set(user_ratings[user_ratings > 0].index)
    recommendations = {}

    for similar_user, similarity in similar_users.items():
        similar_user_ratings = rating_matrix.loc[similar_user]
        for product, rating in similar_user_ratings.items():
            if product not in rated_products and product not in recommendations:
                recommendations[product] = (rating * similarity, similarity)

    predicted_ratings = {product: total_rating / total_similarity if total_similarity != 0 else 0 for product, (total_rating, total_similarity) in recommendations.items()}
    sorted_predicted_ratings = sorted(predicted_ratings.items(), key=lambda x: x[1], reverse=True)
    return sorted_predicted_ratings[:top_n]

 # Get recommendations for a specific user ID
 #user_id = "644e3d8ba5e1e39e1a63b72d"
 #recommendations = predict_ratings(user_id)
 #print("Top 5 product recommendations for user", user_id, ":", [product_id for product_id, _ in recommendations])


 equipment_options = df["product_id"].unique().tolist()

 # Content-based filtering
 def create_feature_vector(equipment_rating_vector):
    equipment_rating_dict = dict(equipment_rating_vector)
    feature_vector = [equipment_rating_dict.get(equipment, 0) for equipment in equipment_options]
    return feature_vector

 user_profiles = df.groupby(['user_id', 'user_name', 'user_age']).apply(lambda x: pd.Series({
     'equipment_rating_vector': list(zip(x['product_id'], x['rating']))
 })).reset_index()

 user_profiles['feature_vector'] = user_profiles['equipment_rating_vector'].apply(create_feature_vector)

 scaler = MinMaxScaler()
 user_profiles['normalized_feature_vector'] = list(scaler.fit_transform(user_profiles['feature_vector'].to_list()))

 similarity_matrix1 = cosine_similarity(user_profiles['normalized_feature_vector'].to_list())

 def content_based_recommendations(user_id, num_recommendations=5):
    user_index = user_profiles[user_profiles['user_id'] == user_id].index[0]
    user_similarities = similarity_matrix1[user_index]

    top_similar_user_indices = np.argsort(-user_similarities)[1:num_recommendations+1]

    recommendations = []
    for index in top_similar_user_indices:
        similar_user_id = user_profiles.iloc[index]['user_id']
        similar_user_transactions = df[df['user_id'] == similar_user_id]
        similar_user_top_rated = similar_user_transactions[similar_user_transactions['rating'] >= 3]
        recommendations.extend(similar_user_top_rated['product_id'].to_list())

    return list(set(recommendations))

 #print(content_based_recommendations('644e3d8ba5e1e39e1a63b712', num_recommendations =5))

 def switcher_recommendations(user_id):
     
    # Count number of user rated products
    rated_products_count = len(df[df['user_id'] == user_id])

    # Calculate avg similarity score between target user & other users
    avg_similarity = user_similarity[user_id].mean()

    # Set thresholds for switching b/w recommendation models
    rated_products_threshold = 3
    similarity_threshold = user_similarity.mean().max() #highest average similarity score given the dataset

    # If user rated products <  threshold or the avg similarity < threshold, use content-based filtering
    if rated_products_count < rated_products_threshold or avg_similarity < similarity_threshold:
        if avg_similarity > similarity_threshold:
                 recom = predict_ratings(user_id)
                 return [product_id for product_id, _ in recom]
                       
        return content_based_recommendations(user_id)
    else:
        #collab filtering
        recom = predict_ratings(user_id)
        return [product_id for product_id, _ in recom]
     
    #r = random.choice([True, False])
    #userCheck1 = userCheck(user_id)
    #if(user_check1 == False):
    #if r == True:
    #     return content_based_recommendations(user_id)
    #else:
    #      recom = predict_ratings(user_id)
    #      return [product_id for product_id, _ in recom] 

 def print_recommendations(user_id, recommendations):
    print(f"Top {len(recommendations)} recommendations for User {user_id}:")
    for equipment in recommendations:
        print(f"Equipment: {equipment}")
    #print(user_similarity.mean().max())

 user_id = user
 recommendations = switcher_recommendations(user_id)
 #print_recommendations(user_id, recommendations)

 return recommendations

@app.route('/recommend', methods=['POST'])

def recommend_products():
    ## Get the user_id and inputArray from the request body
    data = request.get_json()
    user_id = data.get('user_id')
    print(user_id)
    users_review_history = data.get('users_review_history')

    # Call the recommendation_sys function to get recommendations
    recommendations = recommendation_sys(user_id, users_review_history)

    # Return the recommendations as a JSON response
    return jsonify(recommendations)

if __name__ == '__main__':
    app.run()

#This is how you will call the recommender function. Print statements are for checking results
#recommendations = recommendation_sys('644e3d8ba5e1e39e1a63b72d',[{"user_id":"644e3d8ba5e1e39e1a63b72d","user_name":"Sara Shahzaib","user_age":27,"product_id":"63e239d0c53615dca0911511","rating":5},{"user_id":"644e3d8ba5e1e39e1a63b6d0","user_name":"Ali Sara","user_age":19,"product_id":"6449938d066c1c63114f9fd8","rating":5},{"user_id":"644e3d8ba5e1e39e1a63b712","user_name":"Ahmed Mohammed","user_age":26,"product_id":"6449938d066c1c63114f9fd8","rating":4},{"user_id":"644be64647fa164fe9e19bd9","user_name":"Sameed Ahmed","user_age":23,"product_id":"64499482066c1c63114f9ffd","rating":4.5},{"user_id":"644e3d8ba5e1e39e1a63b716","user_name":"Zainab Hassan","user_age":34,"product_id":"64499482066c1c63114f9ffd","rating":3.5},{"user_id":"644e3d8ba5e1e39e1a63b72d","user_name":"Sara Shahzaib","user_age":27,"product_id":"64499574066c1c63114fa045","rating":2.5},{"user_id":"644e3d8ba5e1e39e1a63b710","user_name":"Raza Sana","user_age":28,"product_id":"644997f0bed8780e7aaf9e5b","rating":0},{"user_id":"644be64647fa164fe9e19bd9","user_name":"Sameed Ahmed","user_age":23,"product_id":"64499984bed8780e7aaf9ee0","rating":5},{"user_id":"644e3d8ba5e1e39e1a63b72c","user_name":"Hassan Sana","user_age":28,"product_id":"64499984bed8780e7aaf9ee0","rating":2},{"user_id":"644e3d8ba5e1e39e1a63b717","user_name":"Mohammed Zainab","user_age":18,"product_id":"644999dbbed8780e7aaf9ee4","rating":5},{"user_id":"644e3d8ba5e1e39e1a63b729","user_name":"Shayan Omar","user_age":27,"product_id":"64499a1abed8780e7aaf9ee8","rating":0},{"user_id":"644e3d8ba5e1e39e1a63b72b","user_name":"Ahmed Mowahid","user_age":18,"product_id":"64499aaebed8780e7aaf9f5b","rating":2.5},{"user_id":"644e3d8ba5e1e39e1a63b703","user_name":"Sara Fatima","user_age":29,"product_id":"644bca977873890d43e912f4","rating":2},{"user_id":"644e3d8ba5e1e39e1a63b709","user_name":"Sara Sana","user_age":27,"product_id":"644bcac07873890d43e912f8","rating":1},{"user_id":"644e3d8ba5e1e39e1a63b713","user_name":"Sara Mowahid","user_age":25,"product_id":"644bcb1e7873890d43e91329","rating":3},{"user_id":"644e3d8ba5e1e39e1a63b71c","user_name":"Omar Shayan","user_age":25,"product_id":"644bcb6d7873890d43e9132d","rating":2.5},{"user_id":"644e3d8ba5e1e39e1a63b6ff","user_name":"Aisha Hassan","user_age":33,"product_id":"644bcb8d7873890d43e91331","rating":3},{"user_id":"644e3d8ba5e1e39e1a63b6f3","user_name":"Ahmed Hussein","user_age":20,"product_id":"644bcc24ac5f5829b4b47323","rating":2.5},{"user_id":"644e3d8ba5e1e39e1a63b71c","user_name":"Omar Shayan","user_age":25,"product_id":"644bcc8eac5f5829b4b4733d","rating":1},{"user_id":"644e3d8ba5e1e39e1a63b72e","user_name":"Sana Raza","user_age":27,"product_id":"644bcccfac5f5829b4b47358","rating":4.5},{"user_id":"644e3d8ba5e1e39e1a63b72e","user_name":"Sana Raza","user_age":27,"product_id":"644bcd38ac5f5829b4b47374","rating":2},{"user_id":"644e3d8ba5e1e39e1a63b727","user_name":"Sana Ahmed","user_age":28,"product_id":"644bcda7ac5f5829b4b47407","rating":4},{"user_id":"644e3d8ba5e1e39e1a63b72e","user_name":"Sana Raza","user_age":27,"product_id":"644bcdd6ac5f5829b4b47425","rating":3},{"user_id":"644e3d8ba5e1e39e1a63b703","user_name":"Sara Fatima","user_age":29,"product_id":"644bce4dac5f5829b4b47444","rating":5},{"user_id":"644e3d8ba5e1e39e1a63b726","user_name":"Mowahid Ahmed","user_age":26,"product_id":"644bce80ac5f5829b4b47463","rating":1.5},{"user_id":"644e3d8ba5e1e39e1a63b71e","user_name":"Omar Ahmed","user_age":18,"product_id":"644bcee5ac5f5829b4b47482","rating":5},{"user_id":"644e3d8ba5e1e39e1a63b71a","user_name":"Ahmed Mowahid","user_age":33,"product_id":"644bcf1cac5f5829b4b47486","rating":3.5},{"user_id":"644e3d8ba5e1e39e1a63b70c","user_name":"Mowahid Raza","user_age":25,"product_id":"644bcf73ac5f5829b4b474a5","rating":3},{"user_id":"644e3d8ba5e1e39e1a63b72c","user_name":"Hassan Sana","user_age":28,"product_id":"644bcfa5ac5f5829b4b474a9","rating":4.5},{"user_id":"644e3d8ba5e1e39e1a63b6ea","user_name":"Shayan Shahzaib","user_age":24,"product_id":"644bcfd2ac5f5829b4b474ad","rating":0},{"user_id":"644e3d8ba5e1e39e1a63b725","user_name":"Shayan Zainab","user_age":21,"product_id":"644bd042ac5f5829b4b474cc","rating":0},{"user_id":"644e3d8ba5e1e39e1a63b72c","user_name":"Hassan Sana","user_age":28,"product_id":"644bd07bac5f5829b4b474d0","rating":4},{"user_id":"644e3d8ba5e1e39e1a63b712","user_name":"Ahmed Mohammed","user_age":26,"product_id":"644bd0c0ac5f5829b4b474ef","rating":3.5},{"user_id":"644e3d8ba5e1e39e1a63b706","user_name":"Mowahid Zainab","user_age":24,"product_id":"644bd0dbac5f5829b4b474f3","rating":2},{"user_id":"644e3d8ba5e1e39e1a63b704","user_name":"Fatima Aisha","user_age":21,"product_id":"644bd15aac5f5829b4b47559","rating":0.5},{"user_id":"644e3d8ba5e1e39e1a63b71b","user_name":"Mowahid Mowahid","user_age":20,"product_id":"644bd18aac5f5829b4b4755d","rating":3.5},{"user_id":"644e3d8ba5e1e39e1a63b71b","user_name":"Mowahid Mowahid","user_age":20,"product_id":"644bd211ac5f5829b4b47561","rating":0.5},{"user_id":"644e3d8ba5e1e39e1a63b715","user_name":"Aisha Hassan","user_age":24,"product_id":"644bd243ac5f5829b4b47565","rating":3.5},{"user_id":"644e3d8ba5e1e39e1a63b6f6","user_name":"Ahmed Ahmed","user_age":23,"product_id":"644bd2ddac5f5829b4b47596","rating":2},{"user_id":"644e3d8ba5e1e39e1a63b716","user_name":"Zainab Hassan","user_age":34,"product_id":"644bd318ac5f5829b4b4759a","rating":4.5},{"user_id":"644e3d8ba5e1e39e1a63b708","user_name":"Ahmed Hassan","user_age":26,"product_id":"644bd3fcac5f5829b4b4759e","rating":0},{"user_id":"644e3d8ba5e1e39e1a63b6f4","user_name":"Ahmed Zaki","user_age":35,"product_id":"644bd43cac5f5829b4b475a2","rating":4},{"user_id":"644e3d8ba5e1e39e1a63b724","user_name":"Aisha Sana","user_age":34,"product_id":"644bd466ac5f5829b4b475a6","rating":0},{"user_id":"644e3d8ba5e1e39e1a63b728","user_name":"Zainab Ali","user_age":21,"product_id":"644bd502ac5f5829b4b475f1","rating":0},{"user_id":"644e3d8ba5e1e39e1a63b718","user_name":"Zainab Ahmed","user_age":25,"product_id":"644bd570ac5f5829b4b475f5","rating":4.5},{"user_id":"644e3d8ba5e1e39e1a63b728","user_name":"Zainab Ali","user_age":21,"product_id":"644bd5c8ac5f5829b4b475f9","rating":5},{"user_id":"644e3d8ba5e1e39e1a63b72e","user_name":"Sana Raza","user_age":27,"product_id":"644bd60eac5f5829b4b475fd","rating":4},{"user_id":"644e3d8ba5e1e39e1a63b6ca","user_name":"Sara Shahzaib","user_age":32,"product_id":"644bd6d6ac5f5829b4b47601","rating":4},{"user_id":"644e3d8ba5e1e39e1a63b718","user_name":"Zainab Ahmed","user_age":25,"product_id":"644bd70fac5f5829b4b47605","rating":4},{"user_id":"644e3d8ba5e1e39e1a63b711","user_name":"Ali Hassan","user_age":26,"product_id":"644bd733ac5f5829b4b47609","rating":3.5},{"user_id":"644e3d8ba5e1e39e1a63b71d","user_name":"Mowahid Ali","user_age":25,"product_id":"644bd749ac5f5829b4b4760d","rating":3.5},{"user_id":"644e3d8ba5e1e39e1a63b6cb","user_name":"Hussein Mohammed","user_age":25,"product_id":"644bd7f7ac5f5829b4b4762c","rating":2.5},{"user_id":"644e3d8ba5e1e39e1a63b725","user_name":"Shayan Zainab","user_age":21,"product_id":"644bd823ac5f5829b4b47630","rating":2.5},{"user_id":"644e3d8ba5e1e39e1a63b71e","user_name":"Omar Ahmed","user_age":18,"product_id":"644bd842ac5f5829b4b47634","rating":2.5},{"user_id":"644e3d8ba5e1e39e1a63b6e9","user_name":"Zaki Mohammed","user_age":25,"product_id":"644bd860ac5f5829b4b47638","rating":4},{"user_id":"644e3d8ba5e1e39e1a63b72a","user_name":"Hussein Mohammed","user_age":30,"product_id":"644bd8abac5f5829b4b47683","rating":1},{"user_id":"644e3d8ba5e1e39e1a63b70a","user_name":"Zaki Shayan","user_age":35,"product_id":"644bd919ac5f5829b4b47687","rating":3},{"user_id":"644e3d8ba5e1e39e1a63b728","user_name":"Zainab Ali","user_age":21,"product_id":"644bd94cac5f5829b4b4768b","rating":3.5},{"user_id":"644e3d8ba5e1e39e1a63b72f","user_name":"Mowahid Fatima","user_age":21,"product_id":"644bd98aac5f5829b4b4768f","rating":4},{"user_id":"644e3d8ba5e1e39e1a63b723","user_name":"Shahzaib Sana","user_age":28,"product_id":"644bd9bdac5f5829b4b47693","rating":1},{"user_id":"644e3d8ba5e1e39e1a63b715","user_name":"Aisha Hassan","user_age":24,"product_id":"644bd9f3ac5f5829b4b47697","rating":2},{"user_id":"644e3d8ba5e1e39e1a63b71b","user_name":"Mowahid Mowahid","user_age":20,"product_id":"644bda52ac5f5829b4b476b6","rating":1.5},{"user_id":"644e3d8ba5e1e39e1a63b70b","user_name":"Ali Zaki","user_age":19,"product_id":"644bda7eac5f5829b4b476ba","rating":4},{"user_id":"644e3d8ba5e1e39e1a63b729","user_name":"Shayan Omar","user_age":27,"product_id":"644bdaafac5f5829b4b476be","rating":0.5},{"user_id":"644e3d8ba5e1e39e1a63b724","user_name":"Aisha Sana","user_age":34,"product_id":"644bdb12ac5f5829b4b476c2","rating":0.5},{"user_id":"644e3d8ba5e1e39e1a63b727","user_name":"Sana Ahmed","user_age":28,"product_id":"644bdb3dac5f5829b4b476c6","rating":3},{"user_id":"644e3d8ba5e1e39e1a63b70a","user_name":"Zaki Shayan","user_age":35,"product_id":"644bdb67ac5f5829b4b476ca","rating":3},{"user_id":"644e3d8ba5e1e39e1a63b723","user_name":"Shahzaib Sana","user_age":28,"product_id":"644bdbb7ac5f5829b4b47701","rating":0},{"user_id":"644e3d8ba5e1e39e1a63b72f","user_name":"Mowahid Fatima","user_age":21,"product_id":"644bdbe2ac5f5829b4b47705","rating":2.5}])
#print(f"Top {len(recommendations)} recommendations for User:")
#for equipment in recommendations:
    #print(f"Equipment: {equipment}")