package org.adiga.navigationdrawer

import android.support.v4.app.Fragment
import android.support.v4.app.FragmentManager
import android.support.v4.app.FragmentPagerAdapter

class MyPagerAdapter(fragmentManager: FragmentManager): FragmentPagerAdapter(fragmentManager) {

    enum class APP_TAB(val index:Int){
        FETCH(0),
        ADD(1),
        UPDATE(2),
        SEARCH(3)
//        GET_ONE(1)
    }

    override fun getItem(position: Int): Fragment {
        return when(position) {
            0 -> {
                FragmentFetchItems()
            }

            1 -> FragmentAddItem()

            2 -> FragmentUpdateItem()

            else -> {
                return FragmentSearchItems()
            }
        }
    }

    override fun getCount(): Int {
        return APP_TAB.values().size
    }

    override fun getPageTitle(position: Int): CharSequence {
        return when(position) {
            0 -> "Fetch"
            1 -> "Add"
            2 -> "Update"
            else -> {
                return "Search"
            }
        }
    }

}