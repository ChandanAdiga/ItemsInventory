package org.adiga.navigationdrawer

import android.content.Context
import android.content.DialogInterface
import android.os.Bundle
import android.support.v4.app.Fragment
import android.support.v7.app.AlertDialog
import android.support.v7.widget.LinearLayoutManager
import android.support.v7.widget.PopupMenu
import android.support.v7.widget.RecyclerView
import android.util.Log
import android.view.*
import android.widget.LinearLayout
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.disposables.Disposable
import io.reactivex.schedulers.Schedulers
import kotlinx.android.synthetic.main.fg_fetch_items.*
import kotlinx.android.synthetic.main.rv_item.view.*
import org.adiga.rest.ItemsApiService
import org.adiga.rest.Model

class FragmentFetchItems: Fragment() {

    private val TAG: String = "FragmentFetchItems"

    private val itemsApiService by lazy {
        ItemsApiService.init()
    }

    var disposable: Disposable? = null

    private var mView:View? = null
    var mContext: Context? = null

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        mView = inflater.inflate(R.layout.fg_fetch_items, container, false)
        return mView;
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
        mContext = context

    }

    override fun onStart() {
        super.onStart()
        fetchAllItems()
    }

    override fun onStop() {
        super.onStop()
        disposable?.dispose()
    }

    private fun fetchAllItems() {
        llProgressbarViewFetchItems.visibility = View.VISIBLE
        tv_status_fetch_items.visibility = View.VISIBLE
        tv_status_fetch_items.text = "Loading.."

        disposable = itemsApiService.getAllItems()
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(
                        {result -> showResult(result.items)},
                        {error -> showError(error.message)})

    }

    private fun showResult(items: Array<Model.Item>) {
        Log.d(TAG, "showResult(), Items count: " + items.size)
        tv_status_fetch_items.visibility = View.GONE
        llProgressbarViewFetchItems.visibility = View.GONE
//            Log.d(TAG, "showResult() > [" + item._id + "|" + item.name + "|" + item.price + "|" + item.category + "|" + item.tags + "]")
//        }
//        rv_fetched_items_list.layoutManager = LinearLayoutManager(mContext)
        rv_fetched_items_list.adapter = MyAdapter(mContext,this, items);
    }

    private fun showError(message: String?) {
        Log.e(TAG, "showError(), error: " + message)
        tv_status_fetch_items.text = "Error!" + message
        llProgressbarViewFetchItems.visibility = View.GONE
    }

    fun onSelectUpdateItem(item:Model.Item) {
        //TODO
    }

    fun onSelectDeleteItem(item:Model.Item) {
        var confirmDeleteDialog: AlertDialog = AlertDialog.Builder(mContext!!)
                .setTitle("Delete Item..")
                .setMessage("You are about to delete item '" + item.name + "'.\nAre you sure?")
                .setPositiveButton( "Cancel",null)
                .setNegativeButton("Yes, Delte", { dialogInterface, which -> onConfirmDeleteItem(item) })
                .create()
        confirmDeleteDialog.show()

    }

    private fun onConfirmDeleteItem(item:Model.Item) {
        Log.d("FragmentFetchItems", "onConfirmDeleteItem() : " + item.name)
        llProgressbarViewFetchItems.visibility = View.VISIBLE
        disposable = itemsApiService.deleteItem(item._id)
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(
                        {result -> onDeleteItemSuccess(result.message)},
                        {error -> showError(error.message)})
    }

    private fun onDeleteItemSuccess(message: String) {
        Log.d(TAG, "onDeleteItemSuccess(), message: " + message)
        fetchAllItems()
    }


    class MyViewHolder(view :View): RecyclerView.ViewHolder(view) {
        val tvId = view.tv_id
        val tvName = view.tv_name
        val tvPrice = view.tv_price
        val tvCategory = view.tv_category
        val tvTags = view.tv_tags
        val tvMenu = view.tv_item_menu
    }


    class MyAdapter(val context: Context?, val fragRef: FragmentFetchItems, val itemsList: Array<Model.Item> ):RecyclerView.Adapter<MyViewHolder>() {

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
            holder.tvMenu.setOnClickListener{onClickItemMenu(holder.tvMenu, item)}
        }

        fun onClickItemMenu(view:View, item: Model.Item) {
            var itemMenuPopup = PopupMenu(context!!, view)
            itemMenuPopup.inflate(R.menu.item_menu)
            itemMenuPopup.setOnMenuItemClickListener{
                when(it.itemId) {
                    R.id.item_menu_update -> {
                        Log.d("FragmentFetchItems", "onClickMenuOption() > Updating item: " + item.name)
                        fragRef.onSelectUpdateItem(item)
                    }
                    R.id.item_menu_delete -> {
                        Log.d("FragmentFetchItems", "onClickMenuOption() > Initiating delete item: " + item.name)
                        fragRef.onSelectDeleteItem(item)
                    }
                    else -> {
                        Log.d("FragmentFetchItems", "onClickMenuOption() > Not a defined option")
                    }
                }
                true
            }
            itemMenuPopup.show()
        }

    }




}