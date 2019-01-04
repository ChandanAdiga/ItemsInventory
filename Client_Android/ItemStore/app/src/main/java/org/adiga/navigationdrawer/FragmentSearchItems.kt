package org.adiga.navigationdrawer

import android.content.Context
import android.os.Bundle
import android.support.v4.app.Fragment
import android.support.v7.widget.RecyclerView
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.disposables.Disposable
import io.reactivex.schedulers.Schedulers
import kotlinx.android.synthetic.main.fg_search_items.*
import kotlinx.android.synthetic.main.rv_item.view.*
import org.adiga.rest.ItemsApiService
import org.adiga.rest.Model
import android.app.Activity
import android.view.inputmethod.InputMethodManager


class FragmentSearchItems: Fragment() {

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fg_search_items, container, false)
    }


    val TAG: String = "FragmentFetchItems"

    val itemsApiService by lazy {
        ItemsApiService.init()
    }

    var disposable: Disposable? = null

    var mView:View? = null
    var mContext: Context? = null

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
        mContext = context
    }

    override fun onStart() {
        super.onStart()
        etSearchFieldSearchItems.setText("")
        btSearchInSearchItems.setOnClickListener { searchAllItems(etSearchFieldSearchItems.text.toString()) }
    }

    override fun onStop() {
        super.onStop()
        disposable?.dispose()
    }

    private fun hideSoftKeyboard() {
        val inputMethodManager = activity?.getSystemService(
                Activity.INPUT_METHOD_SERVICE) as InputMethodManager
        inputMethodManager!!.hideSoftInputFromWindow(
                activity?.currentFocus!!.windowToken, 0)
    }

    private fun searchAllItems(query:String) {
        hideSoftKeyboard()
        tv_status_search.visibility = View.VISIBLE
        llProgressbarViewSearchItems.visibility = View.VISIBLE
        tv_status_search.text = "Searching.."

        disposable = itemsApiService.searchItems(query)
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(
                        {result -> showResult(result.items)},
                        { error -> showError("Error: ${error.message}")})

    }

    private fun showResult(items: Array<Model.Item>) {
        Log.d(TAG, "showResult(), Items count: " + items.size)
        tv_status_search.visibility = View.GONE
        llProgressbarViewSearchItems.visibility = View.GONE
//            Log.d(TAG, "showResult() > [" + item._id + "|" + item.name + "|" + item.price + "|" + item.category + "|" + item.tags + "]")
//        }
//        rv_searched_items_list.layoutManager = LinearLayoutManager(mContext)
        rv_searched_items_list.adapter = MyAdapter(mContext,items)
        if(items.isEmpty()) {
            showError("No items found!")
        }
    }

    private fun showError(message: String?) {
        Log.e(TAG, "showError(), error: $message")
        llProgressbarViewSearchItems.visibility = View.GONE
        tv_status_search.visibility = View.VISIBLE
        tv_status_search.text = message
    }

    class MyViewHolder(view :View): RecyclerView.ViewHolder(view) {
        val tvId = view.tv_id
        val tvName = view.tv_name
        val tvPrice = view.tv_price
        val tvCategory = view.tv_category
        val tvTags = view.tv_tags
    }


    class MyAdapter(val context: Context?, val itemsList: Array<Model.Item> ): RecyclerView.Adapter<MyViewHolder>() {

        override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): MyViewHolder {
            return MyViewHolder(LayoutInflater.from(context).inflate(R.layout.rv_item,parent,false))
        }

        override fun getItemCount(): Int {
            return itemsList.size
        }

        override fun onBindViewHolder(holder: MyViewHolder, position: Int) {
            val item: Model.Item = itemsList.get(position)
            holder.tvId.text = item._id
            holder.tvName.text = item.name
            holder.tvPrice.text = ""+item.price
            holder.tvCategory.text = item.category
            holder.tvTags.text = item.tags

        }
    }

}