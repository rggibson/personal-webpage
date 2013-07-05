function loadXMLDoc( dname ) {
    if (window.XMLHttpRequest) {
	xhttp=new XMLHttpRequest();
    } else {
	xhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhttp.open("GET", dname, false);
    xhttp.send();
    return xhttp.responseXML;
}

function toggleAbstract( abstract_id ) {
    var abs_elem = document.getElementById("abstract-" + abstract_id);
    var show_elem = document.getElementById("show-hide-abstract-" + abstract_id);

    if( abs_elem.style.display == "block" ) {
	show_elem.innerHTML = "Show abstract";
	abs_elem.style.display = "none";
    } else {
	show_elem.innerHTML = "Hide abstract";
	abs_elem.style.display = "block";
    }
}

function parseDownload( pub_id, type ) {
    var ext = '-' + type + '.pdf';
    if( type == 'bibtex' ) {
	ext = '_bib.html';
    } else if( type == 'extended technical report' ) {
	ext = '-tr.pdf';
    } else if( type == 'supplementary material' ) {
	ext = '-supp.pdf';
    } else if( type == 'code' ) {
	ext = '-code.zip';
    }
    var is_link = type.indexOf("link") + type.indexOf("YouTube");
    if( is_link == -2 ) {
	document.writeln('[<a href="static/work/' 
			 + pub_id + '/' + pub_id + ext + '">' + type + '</a>] ');
    } else {
	document.writeln('[' + type + '] ');
    }
}

function parseProjects( projects_xml, t ) {
    t = t || null;
    var xmlDoc = loadXMLDoc( projects_xml );
    if( xmlDoc === null ) {
	document.writeln('Sorry, xml doc [' + projects_xml + '] could not load.');
	return( null );
    }
    
    var projects = xmlDoc.getElementsByTagName("Project");
    for( var i = 0; i < projects.length; i++ ) {
	var project = projects[ i ];
	var item_id = project.getElementsByTagName("ID");
	if( t == null || item_id.length == 0
	    || t == item_id[0].childNodes[0].nodeValue ) {
	    var project_id = project.getElementsByTagName("Project_ID");
	    var title = project.getElementsByTagName("Title");
	    var image = project.getElementsByTagName("Image");
	    var youtube_id = project.getElementsByTagName("Youtube_ID");
	    var twitter = project.getElementsByTagName("Twitter");
	    var details = project.getElementsByTagName("Details");

	    document.writeln('<div class="item">');
	    if( project_id.length > 0 ) {
		document.writeln('<div class="related-work">');
		document.writeln('[<a href="work?t=' + project_id[0].childNodes[0].nodeValue + '">Related Work</a>]');
		document.writeln('</div>');
	    }
	    document.writeln('<div class="heading">' + title[0].childNodes[0].nodeValue + '</div>');
	    document.writeln('<div class="graphic">');
	    if( youtube_id.length > 0 ) {
		document.writeln('<iframe width="420" height="315" src="http://www.youtube.com/embed/' 
				 + youtube_id[0].childNodes[0].nodeValue 
				 + '" frameborder="0" allowfullscreen></iframe>');
	    }
	    if( image.length > 0 ) {
		document.writeln('<img src="static/images/' +  image[0].childNodes[0].nodeValue + '">');
	    }
	    if( twitter.length > 0 ) {
		// Hack to get twitter feed onto vids page
		document.writeln('<a class="twitter-timeline" href="https://twitter.com/rggibson_" data-widget-id="348846377314439168" data-link-color="#00C0FF" data-chrome="nofooter noborders transparent" data-tweet-limit="1" width="300">Tweets by @rggibson_</a>');
		document.writeln('<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?\'http\':\'https\';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>');
	    }
	    document.writeln('</div>');
	    document.writeln(details[0].childNodes[0].nodeValue);

	    document.writeln('<div style="clear: both"></div>');
	    document.writeln('</div>');
	}
    }
}

function parsePublications( publications_xml, t ) {
    t = t || null;
    var xmlDoc = loadXMLDoc( publications_xml );
    if( xmlDoc === null ) {
	document.writeln('Sorry, xml doc [' + publications.xml + '] could not load.');
	return( null );
    }

    var publications = xmlDoc.getElementsByTagName("Publication");
    var cur_area = '';
    for( var i = 0; i < publications.length; i++ ) {
	var pub = publications[ i ];
	var project_id = pub.getElementsByTagName("Project_ID");
	if( t != null && project_id[0].childNodes[0].nodeValue != t ) {
	    continue;
	}
	var area = pub.getElementsByTagName("Area");
	var pub_id = pub.getElementsByTagName("ID");
	var title = pub.getElementsByTagName("Title");
	var authors = pub.getElementsByTagName("Authors");
	var published = pub.getElementsByTagName("Published");
	var summary = pub.getElementsByTagName("Summary");
	var abs = pub.getElementsByTagName("Abstract");
	var downloads = pub.getElementsByTagName("Download");

	document.writeln('<div class="item">');
	if( t == null && area[0].childNodes[0].nodeValue != cur_area ) {
	    cur_area = area[0].childNodes[0].nodeValue;
	    document.writeln('<div class="pub-area">' + cur_area + '</div>');
	}
	document.writeln('<div class="title">'+title[0].childNodes[0].nodeValue+'</div>');
	document.writeln('<div class="authors">' + authors[0].childNodes[0].nodeValue
			 +'</div>');
	document.writeln('<div class="purpose">'+published[0].childNodes[0].nodeValue+'</div>');
	document.writeln('<div class="summary">'+summary[0].childNodes[0].nodeValue+'</div>');
	document.writeln('<a href="#" class="show-hide-abstract" id="show-hide-abstract-' + i 
			 + '" onclick="toggleAbstract(\'' + i + '\');return false;">' 
			 + 'Show abstract</a>');
	document.writeln('<div id="abstract-' + i + '" class="abstract">' 
			 + abs[0].childNodes[0].nodeValue + '</div>');
	document.writeln('<div class="downloads">');
	for( var j = 0; j < downloads.length; ++j ) {
	    parseDownload( pub_id[0].childNodes[0].nodeValue, downloads[j].childNodes[0].nodeValue );
	}
	document.writeln('</div>');
	document.writeln('</div>');
    }
}

function parseAwards( awards_xml, t ) {
    t = t || null;
    var xmlDoc = loadXMLDoc( awards_xml );
    if( xmlDoc === null ) {
	document.writeln('Sorry, xml doc [' + awards_xml + '] could not load.');
	return( null );
    }
    
    var awards = xmlDoc.getElementsByTagName("Award");
    for( var i = 0; i < awards.length; i++ ) {
	var award = awards[ i ];
	var project_id = award.getElementsByTagName("Project_ID");
	if( t != null && project_id[0].childNodes[0].nodeValue != t ) {
	    continue;
	}
	var name = award.getElementsByTagName("Name");
	var summary = award.getElementsByTagName("Summary");
	var url = award.getElementsByTagName("Link");

	var name_str = name[0].childNodes[0].nodeValue;
	if( url.length > 0 ) {
	    name_str = '<a href="' + url[0].childNodes[0].nodeValue + '">' + name_str + '</a>';
	}

	document.writeln('<div class="item">');
	document.writeln('<div class="title">' + name_str + '</div>');
	document.writeln('<div class="summary">' + summary[0].childNodes[0].nodeValue + '</div>');
	document.writeln('</div>');
    }
}

function parsePresentations( presentations_xml, t ) {
    t = t || null;
    var xmlDoc = loadXMLDoc( presentations_xml );
    if( xmlDoc === null ) {
	document.writeln('Sorry, xml doc [' + presentations.xml + '] could not load.');
	return( null );
    }

    var presentations = xmlDoc.getElementsByTagName("Presentation");
    for( var i = 0; i < presentations.length; i++ ) {
	var pres = presentations[ i ];
	var project_id = pres.getElementsByTagName("Project_ID");
	if( t != null && project_id[0].childNodes[0].nodeValue != t ) {
	    continue;
	}
	var pres_id = pres.getElementsByTagName("ID");
	var subject = pres.getElementsByTagName("Subject");
	var date = pres.getElementsByTagName("Date");
	var purpose = pres.getElementsByTagName("Purpose");
	var downloads = pres.getElementsByTagName("Download");

	document.writeln('<div class="item">');
	document.writeln('<div class="title">' + subject[0].childNodes[0].nodeValue + '</div>');
	document.writeln('<div class="date">' + date[0].childNodes[0].nodeValue
			 +'</div>');
	document.writeln('<div class="purpose">' + purpose[0].childNodes[0].nodeValue + '</div>');
	document.writeln('<div class="downloads">');
	for( var j = 0; j < downloads.length; ++j ) {
	    parseDownload( pres_id[0].childNodes[0].nodeValue, downloads[j].childNodes[0].nodeValue );
	}
	document.writeln('</div>');
	document.writeln('</div>');
    }
}

function parseCourseWork( courseWork_xml, t ) {
    t = t || null;
    var xmlDoc = loadXMLDoc( courseWork_xml );
    if( xmlDoc === null ) {
	document.writeln('Sorry, xml doc [' + courseWork.xml + '] could not load.');
	return( null );
    }

    var projects = xmlDoc.getElementsByTagName("Project");
    for( var i = 0; i < projects.length; i++ ) {
	var project = projects[ i ];
	var project_id = project.getElementsByTagName("Project_ID");
	if( t != null && project_id[0].childNodes[0].nodeValue != t ) {
	    continue;
	}
	var work_id = project.getElementsByTagName("ID");
	var title = project.getElementsByTagName("Title");
	var course = project.getElementsByTagName("Course");
	var instructor = project.getElementsByTagName("Instructor");
	var team = project.getElementsByTagName("Team");
	var downloads = project.getElementsByTagName("Download");

	document.writeln('<div class="item">');
	document.writeln('<div class="title">' + title[0].childNodes[0].nodeValue + '</div>');
	document.writeln('<div class="authors">' + team[0].childNodes[0].nodeValue + '</div>');
	document.writeln('<div class="purpose">For ' + course[0].childNodes[0].nodeValue
			 + ' by ' + instructor[0].childNodes[0].nodeValue + '</div>');
	document.writeln('<div class="downloads">');
	for( var j = 0; j < downloads.length; ++j ) {
	    parseDownload( work_id[0].childNodes[0].nodeValue, downloads[j].childNodes[0].nodeValue );
	}
	document.writeln('</div>');
	document.writeln('</div>');
    }
}
