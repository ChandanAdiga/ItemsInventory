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
import kotlinx.android.synthetic.main.fg_update_item.*
import kotlinx.android.synthetic.main.rv_item.view.*
import org.adiga.rest.ItemsApiService
import org.adiga.rest.Model

class FragmentUpdateItem: Fragment() {

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fg_update_item, container, false)
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
        ll_update_item_content.visibility = View.VISIBLE
        tv_status_update.visibility = View.GONE

        bt_submit_update_item.setOnClickListener { validateAndUpdate() }
    }

    override fun onStop() {
        super.onStop()
        disposable?.dispose()
    }

    fun validateAndUpdate() {
        if(validate()) {
            updateItem()
        }
    }

    fun validate():Boolean {
        if(et_update_item_name.text == null || et_update_item_name.length()<2) {
            Toast.makeText(mContext,"Invalid Item Name!", Toast.LENGTH_SHORT).show()
            return false
        }
        if(et_update_item_price.text == null || et_update_item_price.length()<1) {
            Toast.makeText(mContext,"Invalid Item Price!", Toast.LENGTH_SHORT).show()
            return false
        }
        try {
            var price:Float  = et_update_item_price.text.toString().toFloat()
        } catch (e:Exception) {
            Toast.makeText(mContext,"Invalid Item Price!", Toast.LENGTH_SHORT).show()
            return false
        }
        if(et_update_item_description.text == null || et_update_item_description.length()<2) {
            Toast.makeText(mContext,"Invalid Item Description!", Toast.LENGTH_SHORT).show()
            return false
        }
        if(et_update_item_category.text == null || et_update_item_category.length()<2) {
            Toast.makeText(mContext,"Invalid Item Category!", Toast.LENGTH_SHORT).show()
            return false
        }
        if(et_update_item_tags.text == null || et_update_item_tags.length()<2) {
            Toast.makeText(mContext,"Invalid Item Tags!", Toast.LENGTH_SHORT).show()
            return false
        }
        return true
    }

    fun updateItem() {
        tv_status_update.visibility = View.VISIBLE
        tv_status_update.text = "Updating.."
        ll_update_item_content.visibility = View.GONE

        var item:Model.Item = Model.Item(
                tv_update_item_id.text.toString(),
                et_update_item_name.text.toString(),
                et_update_item_price.text.toString().toFloat(),
                et_update_item_description.text.toString(),
                et_update_item_category.text.toString(),
                et_update_item_tags.text.toString())

        disposable = itemsApiService.updateItem(item)
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(
                        {updatedItem -> showResult(updatedItem)},
                        {error -> showError(error.message)})

    }

    fun showResult(updatedItem: Model.Item) {
        Log.d(TAG, "showResult(), Successfully updated new item: " + updatedItem._id)
        tv_status_update.text = "Successfully updated the Item!"
        Toast.makeText(mContext,"Successfully updated the Item!", Toast.LENGTH_SHORT).show()
        //TODO Navigate back to fetch all..
        tv_status_update.visibility = View.GONE
    }

    fun showError(message: String?) {
        Log.e(TAG, "showError(), error: " + message)
        tv_status_update.text = "Error Updating Item: " + message
        ll_update_item_content.visibility = View.VISIBLE
    }

}