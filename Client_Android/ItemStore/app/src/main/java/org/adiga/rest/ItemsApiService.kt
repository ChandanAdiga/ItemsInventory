package org.adiga.rest

import io.reactivex.Observable
import retrofit2.Retrofit
import retrofit2.adapter.rxjava2.RxJava2CallAdapterFactory
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.*

interface ItemsApiService {

    @GET("getAllItems")
    fun getAllItems() : Observable <Model.ItemsList>

    @GET("getItem")
    fun getItem(@Query("itemId") itemId: String) : Observable <Model.Item>

    @POST("addItem")
    fun addItem(@Body() item: Model.Item) : Observable <Model.Item>

    @POST("updateItem")
    fun updateItem(@Body() item: Model.Item) : Observable <Model.Item>

    @DELETE("deleteItem")
    fun deleteItem(@Query("itemId") itemId: String) : Observable <Model.Result>

    @GET("searchItems")
    fun searchItems(@Query("searchQuery") searchQuery: String) : Observable <Model.ItemsList>


    companion object {

        fun init(): ItemsApiService {

            val retrofit = Retrofit.Builder()
                    .baseUrl("http://127.0.0.1:3332/")//Point to ItemsInventory's appRESTSample server.
                    .addCallAdapterFactory(RxJava2CallAdapterFactory.create())
                    .addConverterFactory(GsonConverterFactory.create())
                    .build()

            return retrofit.create(ItemsApiService::class.java)
        }
    }

}