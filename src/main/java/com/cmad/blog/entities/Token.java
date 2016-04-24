package com.cmad.blog.entities;

import java.io.Serializable;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class Token implements Serializable{

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	@NotNull
	@Column
	private String token;

	@OneToOne(optional = false,fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	//@JoinColumn(name = "USER_ID", nullable = false, unique = true)
	@PrimaryKeyJoinColumn // Create FK constraint on PK column
    @JsonIgnore
	private User user;

	public Token() {
	}

	public Long getTokenId() {
		return id;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	@Override
	public String toString() {
		return "Token [id=" + id + ",  token=" + token + "]";
	}

}