package com.cmad.blog.entities;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

@Entity
public class Post {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long Id;

	@NotNull
	@Column(nullable = false, length = 255)
	private String title;

	@NotNull
	@JsonInclude(Include.NON_NULL)
	@Column(length = 65535, columnDefinition = "Text")
	private String content;

	@NotNull
	protected Date createdOn = new Date();

	@ManyToOne(optional = true, fetch = FetchType.EAGER)
	// This side is really used for DDL generation, e.g. the NOT NULL option)
	protected User user;

	public Post(){
	}
	
	public Post(final String title, final String content) {
		this.title = title;
		this.content = content;
		this.createdOn = new Date();
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public Date getCreatedOn() {
		return createdOn;
	}

	public void setCreatedOn(Date createdOn) {
		this.createdOn = createdOn;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	@Override
	public String toString() {
		return "BlogPost [Id=" + Id + ", title=" + title + ", createdOn=" + createdOn + "]";
	}
}
