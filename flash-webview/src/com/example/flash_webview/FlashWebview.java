package com.example.flash_webview;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;

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
		findViewById(R.id.btn_load_file).setOnClickListener(mBtnOnClickListener);
		findViewById(R.id.btn_load_swf).setOnClickListener(mBtnOnClickListener);
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
			case R.id.btn_load_file:
				intent.setClass(FlashWebview.this, WebViewLoadFileActivity.class);
				startActivity(intent);
				break;
			case R.id.btn_load_swf:
				intent.setClass(FlashWebview.this, WebViewLoadSwfActivity.class);
				startActivity(intent);
				break;
			default:
				break;
			}
		}
	};
}
