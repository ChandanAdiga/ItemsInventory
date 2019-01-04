package org.adiga.rest

object Model {
    data class Item(val _id: String, val name: String, val price: Float, val description: String, val category: String, val tags: String)
    data class ItemsList(val items: Array<Item>)
    data class Result(val message: String)
}