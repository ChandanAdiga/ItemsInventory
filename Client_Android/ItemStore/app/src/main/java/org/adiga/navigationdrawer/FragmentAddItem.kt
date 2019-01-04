package org.adiga.navigationdrawer

import android.content.Context
import android.os.Bundle
import android.support.v4.app.Fragment
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.disposables.Disposable
import io.reactivex.schedulers.Schedulers
import kotlinx.android.synthetic.main.fg_add_item.*
import kotlinx.android.synthetic.main.fg_fetch_items.*
import kotlinx.android.synthetic.main.rv_item.view.*
import org.adiga.rest.ItemsApiService
import org.adiga.rest.Model

class FragmentAddItem: Fragment() {

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fg_add_item, container, false)
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
        ll_add_item_content.visibility = View.VISIBLE
        tv_status_add.visibility = View.GONE

        bt_submit_add_item.setOnClickListener { validateAndAdd() }
    }

    override fun onStop() {
        super.onStop()
        disposable?.dispose()
    }

    fun validateAndAdd() {
        if(validate()) {
            addItem()
        }
    }

    fun validate():Boolean {
        if(et_add_item_name.text == null || et_add_item_name.length()<2) {
            Toast.makeText(mContext,"Invalid Item Name!", Toast.LENGTH_SHORT).show()
            return false
        }
        if(et_add_item_price.text == null || et_add_item_price.length()<1) {
            Toast.makeText(mContext,"Invalid Item Price!", Toast.LENGTH_SHORT).show()
            return false
        }
        try {
            var price:Float  = et_add_item_price.text.toString().toFloat()
        } catch (e:Exception) {
            Toast.makeText(mContext,"Invalid Item Price!", Toast.LENGTH_SHORT).show()
            return false
        }
        if(et_add_item_description.text == null || et_add_item_description.length()<2) {
            Toast.makeText(mContext,"Invalid Item Description!", Toast.LENGTH_SHORT).show()
            return false
        }
        if(et_add_item_category.text == null || et_add_item_category.length()<2) {
            Toast.makeText(mContext,"Invalid Item Category!", Toast.LENGTH_SHORT).show()
            return false
        }
        if(et_add_item_tags.text == null || et_add_item_tags.length()<2) {
            Toast.makeText(mContext,"Invalid Item Tags!", Toast.LENGTH_SHORT).show()
            return false
        }
        return true
    }

    fun addItem() {
        tv_status_add.visibility = View.VISIBLE
        tv_status_add.text = "Adding.."
        ll_add_item_content.visibility = View.GONE

        var item:Model.Item = Model.Item("",
                et_add_item_name.text.toString(),
                et_add_item_price.text.toString().toFloat(),
                et_add_item_description.text.toString(),
                et_add_item_category.text.toString(),
                et_add_item_tags.text.toString())
        disposable = itemsApiService.addItem(
                item)
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(
                        {addedItem -> showResult(addedItem)},
                        {error -> showError(error.message)})

    }

    fun showResult(addedItem: Model.Item) {
        Log.d(TAG, "showResult(), Successfully added new item: " + addedItem._id)
        tv_status_add.text = "Successfully added new Item!"
        Toast.makeText(mContext,"Successfully added new Item!", Toast.LENGTH_SHORT).show()
        //TODO Navigate back to fetch all..
//        tv_status_add.visibility = View.GONE
    }

    fun showError(message: String?) {
        Log.e(TAG, "showError(), error: " + message)
        tv_status_add.text = "Error Adding Item: " + message
        ll_add_item_content.visibility = View.VISIBLE
    }
}