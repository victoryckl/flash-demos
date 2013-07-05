
function createFlash(flashURL, id, w, h) {
	document.writeln ('<table width="'+w+'" height="'+h+'" cellpadding="0" cellspacing="0" border="0">');
	document.writeln ('	<tr>');
	document.writeln ('		<td align="center" valign="middle">');
	document.writeln ('		<object type="application/x-shockwave-flash"');
	document.writeln ('			id="'+id+'" ');
	document.writeln ('			align="middle"');
	document.writeln ('			data="'+flashURL+'"');
	document.writeln ('			wmode=""');
	document.writeln ('			height="100%" ');
	document.writeln ('			width="100%">');
	document.writeln ('				<param name="movie" value="'+flashURL+'">');
	document.writeln ('				<param name="quality" value="high">');
	document.writeln ('				<param name="wmode" value="window">');
	document.writeln ('				<param name="allowScriptAccess" value="always">');
	document.writeln ('				<param name="menu" value="false">');
	document.writeln ('				<param name="scale" value="showall">');
	document.writeln ('				<param name="allowFullScreen" value="true">');
	document.writeln ('		</object>');
	document.writeln ('		</td> ');
	document.writeln ('	</tr> ');
	document.writeln ('</table> ');
}
