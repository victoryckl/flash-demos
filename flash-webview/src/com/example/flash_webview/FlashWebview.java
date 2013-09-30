package com.example.flash_webview;

import java.util.ArrayList;
import java.util.List;

import android.os.Bundle;
import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.View.OnClickListener;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebSettings.PluginState;

public class FlashWebview extends Activity {

	private static final String TAG = FlashWebview.class.getSimpleName();
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_flash_webview);
		
		initViews();
	}
	
	private void initViews() {
		findViewById(R.id.btn_webplayer).setOnClickListener(mBtnOnClickListener);
		findViewById(R.id.btn_viewpager).setOnClickListener(mBtnOnClickListener);
	}
	
	private OnClickListener mBtnOnClickListener = new OnClickListener() {
		@Override
		public void onClick(View v) {
			Intent intent = new Intent();
			switch (v.getId()) {
			case R.id.btn_webplayer:
				intent.setClass(FlashWebview.this, WebPlayer.class);
				startActivity(intent);
				break;
			case R.id.btn_viewpager:
				intent.setClass(FlashWebview.this, ViewPagerPlayer.class);
				startActivity(intent);
				break;
			default:
				break;
			}
		}
	};

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		getMenuInflater().inflate(R.menu.activity_flash_webview, menu);
		return true;
	}
	
	@Override
	public boolean onMenuItemSelected(int featureId, MenuItem item) {
		switch (item.getOrder()) {
		case 100:
			Log.i(TAG, item.toString());
			FlashWebview.this.finish();
			break;

		default:
			break;
		}
		return super.onMenuItemSelected(featureId, item);
	}
}
