package org.mtr.mod.data;

import java.util.ArrayList;
import java.util.List;

public class SlideShowData {

	public final List<String> slides = new ArrayList<>();

	public void addSlide(String content) {
		slides.add(content);
	}

	public void clear() {
		slides.clear();
	}
}
