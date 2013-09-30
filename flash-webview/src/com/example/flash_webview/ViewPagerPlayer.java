package com.example.flash_webview;

import java.util.ArrayList;
import java.util.List;

import android.app.Activity;
import android.os.Bundle;
import android.support.v4.view.PagerAdapter;
import android.support.v4.view.ViewPager;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebSettings;
import android.webkit.WebSettings.PluginState;
import android.webkit.WebView;

public class ViewPagerPlayer extends Activity {

	private List<WebView> mListViews;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.lv_viewpager_player);

		initViews();
	}

	private String[] mPageUrls = new String[] {
			"file:///android_asset/short.html",
			"file:///android_asset/page2.html",
			"file:///android_asset/page2.html",
	};
	
	private void initViews() {
		List<WebView> list = new ArrayList<WebView>();

		for (int i = 0; i < mPageUrls.length; i++) {
			WebView w = new WebView(this);
			webSettings(w);
			w.loadUrl(mPageUrls[i]);
			list.add(w);
		}
		
		ViewPager viewPager = (ViewPager) findViewById(R.id.viewpayer);
		viewPager.setAdapter(new MyViewPagerAdapter(list));
	}

	private void webSettings(WebView view) {
		WebSettings s = view.getSettings();

		s.setJavaScriptEnabled(true);
		s.setPluginState(PluginState.ON);
		s.setTextZoom(100);

		view.setBackgroundColor(0xffffff00);
	}

	class MyViewPagerAdapter extends PagerAdapter {
		private List<WebView> mListViews;

		public MyViewPagerAdapter(List<WebView> list) {
			this.mListViews = list;// 构造方法，参数是我们的页卡，这样比较方便。
		}

		@Override
		public void destroyItem(ViewGroup container, int position, Object object) {
			container.removeView(mListViews.get(position));// 删除页卡
		}

		@Override
		public Object instantiateItem(ViewGroup container, int position) { // 这个方法用来实例化页卡
			container.addView(mListViews.get(position), 0);// 添加页卡
			return mListViews.get(position);
		}

		@Override
		public int getCount() {
			return mListViews.size();// 返回页卡的数量
		}

		@Override
		public boolean isViewFromObject(View arg0, Object arg1) {
			return arg0 == arg1;// 官方提示这样写
		}
	}
}
