package org.adiga.navigationdrawer

import org.junit.Test

import org.junit.Assert.*

/**
 * Example local unit test, which will execute on the development machine (host).
 *
 * See [testing documentation](http://d.android.com/tools/testing).
 */
class ExampleUnitTest {

    @Test
    fun addition_isCorrect() {
        var activity = MainActivity()
        assertEquals("sumMethod() is not correctly implemented!", 4, activity.sumMethod(2,2))
    }
}
